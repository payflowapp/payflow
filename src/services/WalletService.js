const { mutateStore } = require("../lib/store");
const User = require("../models/User");

async function transfer(fromUserId, recipientEmail, amount) {
  const normalizedEmail = User.normalizeEmail(recipientEmail);

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
      id: `txn_${Date.now()}`,
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
