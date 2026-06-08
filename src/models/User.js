const bcrypt = require("bcryptjs");

const { createId } = require("../lib/ids");
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

async function findByEmail(email) {
  const data = await readStore();
  return data.users.find((user) => user.email === normalizeEmail(email)) || null;
}

async function findById(id) {
  const data = await readStore();
  return data.users.find((user) => user.id === id) || null;
}

async function create({ name, email, password }) {
  return mutateStore(async (data) => {
    const normalizedEmail = normalizeEmail(email);
    const existingUser = data.users.find((user) => user.email === normalizedEmail);

    if (existingUser) {
      throw new Error("Email is already registered");
    }

    const createdAt = new Date().toISOString();
    const user = {
      id: createId("usr"),
      name: String(name || "").trim() || "New user",
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 10),
      createdAt
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
