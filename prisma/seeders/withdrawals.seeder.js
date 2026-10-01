import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function seedWithdrawals() {
  console.log("Start seeding withdrawal requests...");

  const teacherUser = await prisma.user.findFirst({
    where: { role: { name: "teacher" } },
  });

  if (!teacherUser) {
    console.log("Missing teacher user for withdrawal requests. Skipping.");
    return;
  }

  const existingRequest = await prisma.withdrawalRequest.findFirst({
    where: { teacherId: teacherUser.id, amount: 250.0 },
  });

  if (!existingRequest) {
    await prisma.withdrawalRequest.create({
      data: {
        teacherId: teacherUser.id,
        amount: 250.0,
        status: "pending",
        adminNotes: "Payout request for July tutoring sessions.",
      },
    });
  }

  console.log("Seeded withdrawal requests successfully.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedWithdrawals()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
    });
}
