require("dotenv").config({ quiet: true });

const { resetStore } = require("./lib/store");

async function seed() {
  const data = await resetStore();

  console.log("Local data store reset.");
  console.log("");
  console.log("Demo accounts:");

  data.users.forEach((user) => {
    console.log(`- ${user.name} <${user.email}> (${user.id})`);
  });

  console.log("");
  console.log("Shared demo password: 12345678");
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
