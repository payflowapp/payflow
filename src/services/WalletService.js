const { hasDatabase, getPool } = require("../lib/db");
const { createId } = require("../lib/ids");
const { mutateStore } = require("../lib/store");
const User = require("../models/User");

async function transfer(fromUserId, recipientEmail, amount) {
  const normalizedEmail = User.normalizeEmail(recipientEmail);

  if (hasDatabase()) {
    const client = await getPool().connect();
    try {
      await client.query("BEGIN");

      const senderRes = await client.query("SELECT id FROM users WHERE id = $1", [fromUserId]);
      const sender = senderRes.rows[0];
      if (!sender) {
        throw new Error("Sender account not found");
      }

      const recipientRes = await client.query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
      const recipient = recipientRes.rows[0];
      if (!recipient) {
        throw new Error("Recipient account not found");
      }

      if (sender.id === recipient.id) {
        throw new Error("You cannot transfer funds to your own account");
      }

      // Lock both wallet rows in a stable order to avoid deadlocks.
      const ids = [sender.id, recipient.id].sort();
      const walletsRes = await client.query(
        "SELECT user_id, balance FROM wallets WHERE user_id = ANY($1) FOR UPDATE",
        [ids]
      );
      const walletByUser = new Map(walletsRes.rows.map((w) => [w.user_id, w]));
      const senderWallet = walletByUser.get(sender.id);
      const recipientWallet = walletByUser.get(recipient.id);

      if (!senderWallet || !recipientWallet) {
        throw new Error("Wallet not found");
      }

      if (Number(senderWallet.balance) < amount) {
        throw new Error("Insufficient funds");
      }

      await client.query("UPDATE wallets SET balance = balance - $1 WHERE user_id = $2", [amount, sender.id]);
      await client.query("UPDATE wallets SET balance = balance + $1 WHERE user_id = $2", [amount, recipient.id]);
      await client.query(
        "INSERT INTO transactions (id, from_user_id, to_user_id, amount, status) VALUES ($1,$2,$3,$4,'success')",
        [createId("txn"), sender.id, recipient.id, amount]
      );

      await client.query("COMMIT");
      return true;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  return mutateStore((data) => {
    const sender = data.users.find((user) => user.id === fromUserId);
    const recipient = data.users.find((user) => user.email === normalizedEmail);

    if (!sender) {
      throw new Error("Sender account not found");
    }
    if (!recipient) {
      throw new Error("Recipient account not found");
    }
    if (sender.id === recipient.id) {
      throw new Error("You cannot transfer funds to your own account");
    }

    const senderWallet = data.wallets.find((wallet) => wallet.userId === sender.id);
    const recipientWallet = data.wallets.find((wallet) => wallet.userId === recipient.id);

    if (!senderWallet || !recipientWallet) {
      throw new Error("Wallet not found");
    }
    if (senderWallet.balance < amount) {
      throw new Error("Insufficient funds");
    }

    senderWallet.balance -= amount;
    recipientWallet.balance += amount;

    data.transactions.push({
      id: createId("txn"),
      fromUserId: sender.id,
      toUserId: recipient.id,
      amount,
      status: "success",
      createdAt: new Date().toISOString()
    });

    return true;
  });
}

module.exports = { transfer };
