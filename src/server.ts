import app from "./app";
import { prisma } from "./lib/prisma";
const PORT = process.env.PORT || 5000;
async function main() {
  try {
    await prisma.$connect();
    console.log("connected to db successfully");
    app.listen(PORT, () => {
      console.log(`server is running on http:localhost:${PORT}`);
    });
  } catch (err) {
    console.error("DB connection error:", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
