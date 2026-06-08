const { randomUUID } = require("crypto");

function createId(prefix) {
  return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

function isValidId(value) {
  return typeof value === "string" && /^[a-z]{3}_[a-z0-9_]+$/i.test(value);
}

module.exports = {
  createId,
  isValidId
};
