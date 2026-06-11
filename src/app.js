require("dotenv").config({ quiet: true });

const express = require("express");

const { ensureStore } = require("./lib/store");
const walletRoutes = require("./routes/WalletRoutes");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/TransactionRoutes");

function getAllowedOrigins() {
  return (
    process.env.CLIENT_ORIGINS ||
    "http://localhost:5173,http://127.0.0.1:5173"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

// Any localhost / 127.0.0.1 origin on any port is allowed in addition to the
// configured list, so Vite picking a different dev port never breaks the app.
const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

function createApp() {
  const app = express();
  const allowedOrigins = getAllowedOrigins();

  function isAllowedOrigin(origin) {
    return allowedOrigins.includes(origin) || LOCAL_ORIGIN.test(origin);
  }

  app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin && isAllowedOrigin(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
    }

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  });

  app.use(express.json());

  app.use("/wallet", walletRoutes);
  app.use("/auth", authRoutes);
  app.use("/transactions", transactionRoutes);

  app.get("/", (req, res) => {
    res.json({
      message: "Payflow API running",
      storage: process.env.DATABASE_URL ? "postgres" : "local-json"
    });
  });

  app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  return app;
}

async function startServer() {
  const app = createApp();
  const port = process.env.PORT || 5000;

  await ensureStore();

  return app.listen(port, () => {
    console.log(`Payflow API listening on http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer().catch((err) => {
    console.error("Failed to start Payflow API:", err.message);
    process.exit(1);
  });
}

module.exports = {
  createApp,
  startServer
};
