import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function seedTransactions() {
  console.log("Start seeding transactions...");

  const wallet = await prisma.wallet.findFirst();

  if (!wallet) {
    console.log("Missing wallet for transaction seeding. Skipping.");
    return;
  }

  const existingTx = await prisma.transaction.findFirst({
    where: { walletId: wallet.id, amount: 500.0 },
  });

  if (!existingTx) {
    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: "CREDIT",
        amount: 500.0,
        status: "completed",
        reason: "Initial system wallet deposit seed",
      },
    });
  }

  console.log("Seeded transactions successfully.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedTransactions()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
    });
}
