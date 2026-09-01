import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function seedStudentQuizzes() {
  console.log("Start seeding student quizzes...");

  const students = await prisma.student.findMany();
  const quizzes = await prisma.quiz.findMany({
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  if (!students.length || !quizzes.length) {
    console.log("No students or quizzes found to seed studentQuizzes. Skipping.");
    return;
  }

  for (const student of students) {
    for (const quiz of quizzes) {
      const existing = await prisma.studentQuiz.findFirst({
        where: {
          student_id: student.id,
          quiz_id: quiz.id,
        },
      });

      if (existing) {
        console.log(`StudentQuiz for student ${student.id} and quiz ${quiz.id} already exists. Skipping.`);
        continue;
      }

      let totalScore = 0;
      const answerRecords = [];

      for (const question of quiz.questions) {
        const correctOpt = question.options.find((opt) => opt.is_correct) || question.options[0];
        const isCorrect = Boolean(correctOpt?.is_correct);
        const points = isCorrect ? question.points : 0;
        totalScore += points;

        answerRecords.push({
          question_id: question.id,
          option_id: correctOpt?.id || null,
          is_correct: isCorrect,
          points: points,
        });
      }

      const passed = totalScore >= quiz.pass_points;

      const created = await prisma.studentQuiz.create({
        data: {
          student_id: student.id,
          quiz_id: quiz.id,
          score: totalScore,
          total_points: quiz.total_points,
          pass_points: quiz.pass_points,
          passed: passed,
          startedAt: new Date(Date.now() - 3600 * 1000),
          submittedAt: new Date(),
          answers: {
            create: answerRecords,
          },
        },
      });

      console.log(`Created studentQuiz ID: ${created.id} for student ${student.id}`);
    }
  }

  console.log("Seeded studentQuizzes successfully.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedStudentQuizzes()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
    });
}
