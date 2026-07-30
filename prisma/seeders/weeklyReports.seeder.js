import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function seedWeeklyReports() {
  console.log("Start seeding weekly reports...");

  const teacher = await prisma.teacher.findFirst();

  if (!teacher) {
    console.log("Missing teacher for weekly reports seeding. Skipping.");
    return;
  }

  const weekStarting = new Date("2026-07-20T00:00:00Z");
  const weekEnding = new Date("2026-07-26T23:59:59Z");

  const existingReport = await prisma.weekly_report.findFirst({
    where: { teacherId: teacher.id, weekStarting },
  });

  if (!existingReport) {
    await prisma.weekly_report.create({
      data: {
        teacherId: teacher.id,
        weekStarting,
        weekEnding,
        totalClasses: 12,
        studentsTaught: 45,
        avgSessionDuration: 60,
        materialsUploaded: 8,
        teachingSummary: "Covered Mechanics and Equations of Motion.",
        studentProgress: "Student participation and scores improved by 15%.",
        challenges: "Internet bandwidth issues during Tuesday session.",
        overallRating: 4.8,
      },
    });
  }

  console.log("Seeded weekly reports successfully.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedWeeklyReports()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
    });
}
