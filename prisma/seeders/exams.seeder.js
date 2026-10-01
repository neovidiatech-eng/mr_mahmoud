import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function seedExams() {
  console.log("Start seeding exams...");

  const student = await prisma.student.findFirst();
  const teacher = await prisma.teacher.findFirst();

  if (!student || !teacher) {
    console.log("Missing student or teacher for exams seeding. Skipping.");
    return;
  }

  const existingExam = await prisma.exam.findFirst({
    where: { title_ar: "Midterm Mathematics Exam" },
  });

  if (!existingExam) {
    const exam = await prisma.exam.create({
      data: {
        title_ar: "Midterm Mathematics Exam",
        title_en: "Midterm Mathematics Exam",
        subject: "Mathematics",
        grade: 0,
        studentId: student.id,
        teacherId: teacher.id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        totalMarks: 100,
        duration: 60,
        status: "pending",
        questions: {
          create: [
            {
              text_ar: "What is 12 x 12?",
              text_en: "What is 12 x 12?",
              type: "mcq",
              points: 50,
              order: 1,
              options: {
                create: [
                  { text_ar: "124", text_en: "124", isCorrect: false, order: 1 },
                  { text_ar: "144", text_en: "144", isCorrect: true, order: 2 },
                  { text_ar: "164", text_en: "164", isCorrect: false, order: 3 },
                ],
              },
            },
            {
              text_ar: "The square root of 81 is 9.",
              text_en: "The square root of 81 is 9.",
              type: "true_false",
              points: 50,
              order: 2,
              options: {
                create: [
                  { text_ar: "True", text_en: "True", isCorrect: true, order: 1 },
                  { text_ar: "False", text_en: "False", isCorrect: false, order: 2 },
                ],
              },
            },
          ],
        },
      },
    });
    console.log("Created exam with ID:", exam.id);
  }

  console.log("Seeded exams successfully.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedExams()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
    });
}
