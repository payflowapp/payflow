const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Wallet = require("../models/Wallet");

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

exports.register = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = User.normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long"
      });
    }

    const user = await User.create({ name, email, password });
    await Wallet.createForUser(user.id, 0);

    res.status(201).json({
      message: "User registered",
      user
    });
  } catch (err) {
    const status = String(err.message).includes("already registered") ? 409 : 500;
    res.status(status).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const email = User.normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({
      token: createToken(user),
      user: User.sanitizeUser(user)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: User.sanitizeUser(user)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
