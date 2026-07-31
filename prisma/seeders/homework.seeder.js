import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function seedHomework() {
  console.log("Start seeding homework...");

  const student = await prisma.student.findFirst();
  const teacher = await prisma.teacher.findFirst();
  const subject = await prisma.subject.findFirst();

  if (!student || !teacher) {
    console.log("Missing student or teacher for homework seeding. Skipping.");
    return;
  }

  const sampleHomeworks = [
    {
      title_ar: "Algebra Assignment 1",
      title_en: "Algebra Assignment 1",
      description_ar: "Solve linear equations and quadratic formulas.",
      description_en: "Solve linear equations and quadratic formulas.",
      status: "pending",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      studentId: student.id,
      teacherId: teacher.id,
      subjectId: subject?.id || null,
    },
    {
      title_ar: "Physics Newton Laws",
      title_en: "Physics Newton Laws",
      description_ar: "Complete exercises on Newton's First and Second laws of motion.",
      description_en: "Complete exercises on Newton's First and Second laws of motion.",
      status: "graded",
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      studentId: student.id,
      teacherId: teacher.id,
      subjectId: subject?.id || null,
      grade: 95.0,
      feedback: "Excellent work! Accurate calculations.",
    },
  ];

  for (const hw of sampleHomeworks) {
    const existing = await prisma.homework.findFirst({
      where: { title_ar: hw.title_ar, studentId: hw.studentId },
    });

    if (!existing) {
      await prisma.homework.create({ data: hw });
    }
  }

  console.log("Seeded homework successfully.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedHomework()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
    });
}
