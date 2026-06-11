const bcrypt = require("bcryptjs");

const { createId } = require("../lib/ids");
const { hasDatabase, query } = require("../lib/db");
const { mutateStore, readStore } = require("../lib/store");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}

function rowToUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at
  };
}

async function findByEmail(email) {
  const normalizedEmail = normalizeEmail(email);

  if (hasDatabase()) {
    const { rows } = await query("SELECT * FROM users WHERE email = $1", [normalizedEmail]);
    return rowToUser(rows[0]);
  }

  const data = await readStore();
  return data.users.find((user) => user.email === normalizedEmail) || null;
}

async function findById(id) {
  if (hasDatabase()) {
    const { rows } = await query("SELECT * FROM users WHERE id = $1", [id]);
    return rowToUser(rows[0]);
  }

  const data = await readStore();
  return data.users.find((user) => user.id === id) || null;
}

async function create({ name, email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const cleanName = String(name || "").trim() || "New user";
  const passwordHash = await bcrypt.hash(password, 10);

  if (hasDatabase()) {
    const existing = await findByEmail(normalizedEmail);
    if (existing) {
      throw new Error("Email is already registered");
    }

    const id = createId("usr");
    const { rows } = await query(
      "INSERT INTO users (id, name, email, password_hash) VALUES ($1,$2,$3,$4) RETURNING *",
      [id, cleanName, normalizedEmail, passwordHash]
    );
    return sanitizeUser(rowToUser(rows[0]));
  }

  return mutateStore(async (data) => {
    const existingUser = data.users.find((user) => user.email === normalizedEmail);
    if (existingUser) {
      throw new Error("Email is already registered");
    }

    const user = {
      id: createId("usr"),
      name: cleanName,
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    data.users.push(user);
    return sanitizeUser(user);
  });
}

module.exports = {
  create,
  findByEmail,
  findById,
  normalizeEmail,
  sanitizeUser
};
