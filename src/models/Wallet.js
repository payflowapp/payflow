const { createId } = require("../lib/ids");
const { mutateStore, readStore } = require("../lib/store");

async function createForUser(userId, balance = 0) {
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
  const data = await readStore();
  return data.wallets.find((wallet) => wallet.userId === userId) || null;
}

module.exports = {
  createForUser,
  findByUserId
};
