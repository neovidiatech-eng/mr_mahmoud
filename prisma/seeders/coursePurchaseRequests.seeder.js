import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function seedCoursePurchaseRequests() {
  console.log("Start seeding course purchase requests...");

  const student = await prisma.student.findFirst();
  const course = await prisma.courses.findFirst();

  if (!student || !course) {
    console.log("Missing student or course for course purchase requests. Skipping.");
    return;
  }

  const existingRequest = await prisma.course_purchase_request.findFirst({
    where: { studentId: student.id, courseId: course.id },
  });

  if (!existingRequest) {
    await prisma.course_purchase_request.create({
      data: {
        studentId: student.id,
        courseId: course.id,
        status: "pending",
        notes: "Requesting access to course via bank transfer payment.",
      },
    });
  }

  console.log("Seeded course purchase requests successfully.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedCoursePurchaseRequests()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
    });
}
