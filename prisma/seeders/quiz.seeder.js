import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.processEnv?.DATABASE_URL || process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function seedQuizzes() {
  console.log("Start seeding quizzes...");

  const existingQuiz = await prisma.quiz.findFirst({
    where: { title_ar: "اختبار تجريبي في الرياضيات" },
  });

  if (!existingQuiz) {
    const quiz = await prisma.quiz.create({
      data: {
        title_ar: "اختبار تجريبي في الرياضيات",
        title_en: "Sample Mathematics Quiz",
        description_ar: "اختبار لتقييم المفاهيم الأساسية في الجبر والهندسة",
        description_en: "Quiz to assess basic concepts in algebra and geometry",
        total_points: 100,
        pass_points: 60,
        duration_min: 30,
        questions: {
          create: [
            {
              question_ar: "ما هو حاصل ضرب 12 في 12؟",
              question_en: "What is 12 multiplied by 12?",
              type: "MCQ",
              points: 50,
              order: 1,
              options: {
                create: [
                  { option_text_ar: "124", option_text_en: "124", is_correct: false },
                  { option_text_ar: "144", option_text_en: "144", is_correct: true },
                  { option_text_ar: "164", option_text_en: "164", is_correct: false },
                ],
              },
            },
            {
              question_ar: "الجذر التربيعي للعدد 81 هو 9.",
              question_en: "The square root of 81 is 9.",
              type: "TRUE_FALSE",
              points: 50,
              order: 2,
              options: {
                create: [
                  { option_text_ar: "صواب", option_text_en: "True", is_correct: true },
                  { option_text_ar: "خطأ", option_text_en: "False", is_correct: false },
                ],
              },
            },
          ],
        },
      },
    });
    console.log("Created quiz with ID:", quiz.id);
  } else {
    console.log("Quiz already exists. Skipping creation.");
  }

  console.log("Seeded quizzes successfully.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedQuizzes()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
    });
}
