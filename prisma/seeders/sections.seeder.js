import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function seedSections() {
  console.log("Start seeding sections...");

  const course = await prisma.courses.findFirst({
    include: { lectures: { orderBy: { order: "asc" } } },
  });

  const quizzes = await prisma.quiz.findMany({ take: 2 });

  if (!course) {
    console.log("No courses found to seed sections for.");
    return;
  }

  const existingSections = await prisma.sections.findMany({
    where: { course_id: course.id },
  });

  if (existingSections.length > 0) {
    console.log("Sections already exist for course:", course.title_ar || course.title_en);
    return;
  }

  const items = [];
  if (course.lectures.length > 0) {
    items.push({
      item_id: course.lectures[0].id,
      item_type: "LECTURE",
      order: 1,
    });
  }
  if (quizzes.length > 0) {
    items.push({
      item_id: quizzes[0].id,
      item_type: "QUIZ",
      order: 2,
    });
  }
  if (course.lectures.length > 1) {
    items.push({
      item_id: course.lectures[1].id,
      item_type: "LECTURE",
      order: 3,
    });
  }

  const section = await prisma.sections.create({
    data: {
      name_ar: "القسم الأول: المقدمة والاختبار التقييمي",
      name_en: "Section 1: Intro and Quiz",
      course_id: course.id,
      section_items: {
        create: items,
      },
    },
  });

  console.log(`Seeded section '${section.name_ar}' with ${items.length} items.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedSections()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
    });
}
