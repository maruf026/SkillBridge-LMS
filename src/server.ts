import app from "./app";
import { prisma } from "./lib/prisma";

async function main() {
  try {
    await prisma.$connect();
    console.log("connected to db successfully");
  } catch (err) {
    console.error("DB connection error:", err);
  }
}

// main();

export default app; 
