const { createId } = require("../lib/ids");
const { hasDatabase, query } = require("../lib/db");
const { mutateStore, readStore } = require("../lib/store");

function rowToWallet(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    balance: Number(row.balance),
    createdAt: row.created_at
  };
}

async function createForUser(userId, balance = 0) {
  if (hasDatabase()) {
    const existing = await findByUserId(userId);
    if (existing) {
      return existing;
    }

    const { rows } = await query(
      "INSERT INTO wallets (id, user_id, balance) VALUES ($1,$2,$3) RETURNING *",
      [createId("wal"), userId, balance]
    );
    return rowToWallet(rows[0]);
  }

  return mutateStore((data) => {
    const existingWallet = data.wallets.find((wallet) => wallet.userId === userId);
    if (existingWallet) {
      return existingWallet;
    }

    const wallet = {
      id: createId("wal"),
      userId,
      balance,
      createdAt: new Date().toISOString()
    };

    data.wallets.push(wallet);
    return wallet;
  });
}

async function findByUserId(userId) {
  if (hasDatabase()) {
    const { rows } = await query("SELECT * FROM wallets WHERE user_id = $1", [userId]);
    return rowToWallet(rows[0]);
  }

  const data = await readStore();
  return data.wallets.find((wallet) => wallet.userId === userId) || null;
}

module.exports = {
  createForUser,
  findByUserId
};
