import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function seedChat() {
  console.log("Start seeding chat...");

  const student = await prisma.student.findFirst();
  const teacher = await prisma.teacher.findFirst();

  if (!student || !teacher) {
    console.log("Missing student or teacher for chat seeding. Skipping.");
    return;
  }

  let conversation = await prisma.conversation.findUnique({
    where: {
      teacherId_studentId: {
        teacherId: teacher.id,
        studentId: student.id,
      },
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        teacherId: teacher.id,
        studentId: student.id,
      },
    });
  }

  const studentUser = await prisma.user.findFirst({ where: { email: student.email } });
  const teacherUser = await prisma.user.findFirst({ where: { email: teacher.email } });

  if (studentUser && teacherUser) {
    const existingMessages = await prisma.message.count({
      where: { conversationId: conversation.id },
    });

    if (existingMessages === 0) {
      await prisma.message.createMany({
        data: [
          {
            conversationId: conversation.id,
            senderId: studentUser.id,
            content: "Hello Teacher, I have a question regarding Newton's second law.",
          },
          {
            conversationId: conversation.id,
            senderId: teacherUser.id,
            content: "Hello! Sure, Force equals mass times acceleration (F = m * a). What specific part would you like help with?",
          },
        ],
      });
    }
  }

  console.log("Seeded chat successfully.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedChat()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
    });
}
