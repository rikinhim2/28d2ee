const db = require("./db");
const { User } = require("./models");
const Conversation = require("./models/conversation");
const Message = require("./models/message");
const ReadStatus = require("./models/readstatus");

async function seed() {
  await db.sync({ force: true });
  console.log("db synced!");
}

async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
  }
}

if (module === require.main) {
  runSeed();
}
