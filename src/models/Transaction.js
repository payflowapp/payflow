const { createId } = require("../lib/ids");
const { hasDatabase, query } = require("../lib/db");
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
    from: fromUser ? { id: fromUser.id, name: fromUser.name, email: fromUser.email } : null,
    to: toUser ? { id: toUser.id, name: toUser.name, email: toUser.email } : null,
    counterparty: counterparty
      ? { id: counterparty.id, name: counterparty.name, email: counterparty.email }
      : null
  };
}

async function create({ fromUserId, toUserId, amount, status = "success" }) {
  if (hasDatabase()) {
    const { rows } = await query(
      "INSERT INTO transactions (id, from_user_id, to_user_id, amount, status) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [createId("txn"), fromUserId, toUserId, amount, status]
    );
    const row = rows[0];
    return {
      id: row.id,
      fromUserId: row.from_user_id,
      toUserId: row.to_user_id,
      amount: Number(row.amount),
      status: row.status,
      createdAt: row.created_at
    };
  }

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
  if (hasDatabase()) {
    const { rows } = await query(
      `SELECT
         t.id, t.amount, t.status, t.created_at,
         t.from_user_id, t.to_user_id,
         fu.name AS from_name, fu.email AS from_email,
         tu.name AS to_name,   tu.email AS to_email
       FROM transactions t
       JOIN users fu ON fu.id = t.from_user_id
       JOIN users tu ON tu.id = t.to_user_id
       WHERE t.from_user_id = $1 OR t.to_user_id = $1
       ORDER BY t.created_at DESC`,
      [userId]
    );

    return rows.map((row) => {
      const isIncoming = row.to_user_id === userId;
      const from = { id: row.from_user_id, name: row.from_name, email: row.from_email };
      const to = { id: row.to_user_id, name: row.to_name, email: row.to_email };
      return {
        id: row.id,
        amount: Number(row.amount),
        status: row.status,
        createdAt: row.created_at,
        direction: isIncoming ? "incoming" : "outgoing",
        from,
        to,
        counterparty: isIncoming ? from : to
      };
    });
  }

  const data = await readStore();
  const usersById = new Map(data.users.map((user) => [user.id, user]));

  return data.transactions
    .filter((transaction) => transaction.fromUserId === userId || transaction.toUserId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((transaction) => enrichTransaction(transaction, usersById, userId));
}

module.exports = {
  create,
  listByUserId
};
