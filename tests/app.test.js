const os = require("os");
const path = require("path");

// Tests run against the isolated JSON store, never a real database.
// Setting DATABASE_URL empty here prevents dotenv from enabling Postgres.
process.env.DATABASE_URL = "";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
process.env.DATA_FILE = path.join(os.tmpdir(), "payflow-test.json");

const fs = require("fs/promises");

const jwt = require("jsonwebtoken");
const request = require("supertest");

const { createApp } = require("../src/app");
const { resetStore } = require("../src/lib/store");
const Wallet = require("../src/models/Wallet");

function authToken(userId = "usr_demo_alex", email = "alex@payflow.local") {
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

describe("Payflow API", () => {
  beforeEach(async () => {
    await resetStore();
  });

  afterAll(async () => {
    try {
      await fs.unlink(process.env.DATA_FILE);
    } catch (err) {
      // Ignore missing test store file.
    }
  });

  test("GET / returns health payload", async () => {
    const app = createApp();

    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Payflow API running",
      storage: "local-json"
    });
  });

  test("POST /auth/register rejects short passwords", async () => {
    const app = createApp();

    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Taylor", email: "taylor@example.com", password: "short" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/at least 8 characters/i);
  });

  test("POST /auth/register creates a local user and wallet", async () => {
    const app = createApp();

    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "Taylor Brooks",
        email: "taylor@example.com",
        password: "12345678"
      });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("taylor@example.com");

    const wallet = await Wallet.findByUserId(res.body.user.id);
    expect(wallet.balance).toBe(0);
  });

  test("POST /auth/login returns a token and user profile", async () => {
    const app = createApp();

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "alex@payflow.local", password: "12345678" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user).toMatchObject({
      id: "usr_demo_alex",
      email: "alex@payflow.local"
    });
  });

  test("GET /auth/me returns the authenticated user", async () => {
    const app = createApp();

    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("alex@payflow.local");
  });

  test("GET /wallet/balance requires auth", async () => {
    const app = createApp();

    const res = await request(app).get("/wallet/balance");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("No token provided");
  });

  test("GET /wallet/balance returns the authenticated user's balance", async () => {
    const app = createApp();

    const res = await request(app)
      .get("/wallet/balance")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      balance: 2450,
      currency: "USD"
    });
  });

  test("POST /wallet/transfer uses recipient email and updates balances", async () => {
    const app = createApp();

    const res = await request(app)
      .post("/wallet/transfer")
      .set("Authorization", `Bearer ${authToken()}`)
      .send({
        recipientEmail: "maya@payflow.local",
        amount: 75
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Transfer successful");

    const alexWallet = await Wallet.findByUserId("usr_demo_alex");
    const mayaWallet = await Wallet.findByUserId("usr_demo_maya");

    expect(alexWallet.balance).toBe(2375);
    expect(mayaWallet.balance).toBe(1400);
  });

  test("GET /transactions returns the authenticated user's ledger", async () => {
    const app = createApp();

    const res = await request(app)
      .get("/transactions")
      .set("Authorization", `Bearer ${authToken()}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("counterparty");
    expect(res.body[0]).toHaveProperty("direction");
  });
});
