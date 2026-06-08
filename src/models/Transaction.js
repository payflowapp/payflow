const { createId } = require("../lib/ids");
const { mutateStore, readStore } = require("../lib/store");

function enrichTransaction(transaction, usersById, currentUserId) {
  const fromUser = usersById.get(transaction.fromUserId);
  const toUser = usersById.get(transaction.toUserId);
  const isIncoming = transaction.toUserId === currentUserId;
  const counterparty = isIncoming ? fromUser : toUser;

  return {
    id: transaction.id,
    amount: transaction.amount,
    status: transaction.status,
    createdAt: transaction.createdAt,
    direction: isIncoming ? "incoming" : "outgoing",
    from: fromUser
      ? { id: fromUser.id, name: fromUser.name, email: fromUser.email }
      : null,
    to: toUser
      ? { id: toUser.id, name: toUser.name, email: toUser.email }
      : null,
    counterparty: counterparty
      ? {
          id: counterparty.id,
          name: counterparty.name,
          email: counterparty.email
        }
      : null
  };
}

async function create({ fromUserId, toUserId, amount, status = "success" }) {
  return mutateStore((data) => {
    const transaction = {
      id: createId("txn"),
      fromUserId,
      toUserId,
      amount,
      status,
      createdAt: new Date().toISOString()
    };

    data.transactions.push(transaction);
    return transaction;
  });
}

async function listByUserId(userId) {
  const data = await readStore();
  const usersById = new Map(data.users.map((user) => [user.id, user]));

  return data.transactions
    .filter((transaction) => {
      return transaction.fromUserId === userId || transaction.toUserId === userId;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((transaction) => enrichTransaction(transaction, usersById, userId));
}

module.exports = {
  create,
  listByUserId
};
