const fs = require("fs/promises");
const path = require("path");

const bcrypt = require("bcryptjs");

function getStoreFile() {
  return process.env.DATA_FILE || path.join(process.cwd(), "data", "payflow.json");
}

async function buildDemoData() {
  const passwordHash = await bcrypt.hash("12345678", 10);
  const now = new Date();
  const earlier = (hoursAgo) => new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString();

  return {
    meta: {
      version: 1,
      seededAt: now.toISOString()
    },
    users: [
      {
        id: "usr_demo_alex",
        name: "Alex Johnson",
        email: "alex@payflow.local",
        passwordHash,
        createdAt: earlier(72)
      },
      {
        id: "usr_demo_maya",
        name: "Maya Chen",
        email: "maya@payflow.local",
        passwordHash,
        createdAt: earlier(71)
      },
      {
        id: "usr_demo_sam",
        name: "Sam Rivera",
        email: "sam@payflow.local",
        passwordHash,
        createdAt: earlier(70)
      }
    ],
    wallets: [
      {
        id: "wal_demo_alex",
        userId: "usr_demo_alex",
        balance: 2450,
        createdAt: earlier(72)
      },
      {
        id: "wal_demo_maya",
        userId: "usr_demo_maya",
        balance: 1325,
        createdAt: earlier(71)
      },
      {
        id: "wal_demo_sam",
        userId: "usr_demo_sam",
        balance: 880,
        createdAt: earlier(70)
      }
    ],
    transactions: [
      {
        id: "txn_demo_001",
        fromUserId: "usr_demo_alex",
        toUserId: "usr_demo_maya",
        amount: 180,
        status: "success",
        createdAt: earlier(8)
      },
      {
        id: "txn_demo_002",
        fromUserId: "usr_demo_maya",
        toUserId: "usr_demo_sam",
        amount: 95,
        status: "success",
        createdAt: earlier(5)
      },
      {
        id: "txn_demo_003",
        fromUserId: "usr_demo_sam",
        toUserId: "usr_demo_alex",
        amount: 40,
        status: "success",
        createdAt: earlier(2)
      }
    ]
  };
}

async function writeStore(data) {
  const storeFile = getStoreFile();
  await fs.mkdir(path.dirname(storeFile), { recursive: true });
  await fs.writeFile(storeFile, JSON.stringify(data, null, 2));
}

async function ensureStore() {
  const storeFile = getStoreFile();

  try {
    await fs.access(storeFile);
  } catch (err) {
    await writeStore(await buildDemoData());
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(getStoreFile(), "utf8");
  return JSON.parse(raw);
}

let writeQueue = Promise.resolve();

function withWriteLock(task) {
  const next = writeQueue.then(task, task);
  writeQueue = next.catch(() => {});
  return next;
}

async function mutateStore(mutator) {
  return withWriteLock(async () => {
    const data = await readStore();
    const result = await mutator(data);
    await writeStore(data);
    return result;
  });
}

async function resetStore() {
  return withWriteLock(async () => {
    const data = await buildDemoData();
    await writeStore(data);
    return data;
  });
}

module.exports = {
  ensureStore,
  mutateStore,
  readStore,
  resetStore
};
