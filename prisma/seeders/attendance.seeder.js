import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function seedAttendance() {
  console.log("Start seeding attendance records...");

  const students = await prisma.student.findMany({
    take: 10,
  });

  if (!students || students.length === 0) {
    console.warn("No students found. Skipping attendance seeding.");
    return;
  }

  const staffUser = await prisma.user.findFirst({
    where: {
      role: {
        name: { in: ["admin", "staff", "superadmin", "teacher"] },
      },
    },
  });

  const checkedInById = staffUser ? staffUser.id : null;

  // Generate attendance records for the last 10 days
  const today = new Date();
  const statuses = ["present", "present", "present", "late", "absent", "present"];

  for (let i = 0; i < 10; i++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - i);
    // Normalize date to YYYY-MM-DD 00:00:00 UTC
    const attendanceDate = new Date(
      Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
    );

    for (let index = 0; index < students.length; index++) {
      const student = students[index];
      const status = statuses[(i + index) % statuses.length];

      const checkInTime = new Date(attendanceDate);
      if (status === "present") {
        checkInTime.setUTCHours(9, 0, 0, 0);
      } else if (status === "late") {
        checkInTime.setUTCHours(9, 45, 0, 0);
      } else {
        checkInTime.setUTCHours(9, 0, 0, 0);
      }

      await prisma.attendance.upsert({
        where: {
          studentId_attendanceDate: {
            studentId: student.id,
            attendanceDate,
          },
        },
        update: {
          status,
          checkedInAt: status !== "absent" ? checkInTime : new Date(attendanceDate),
          checkedInBy: checkedInById,
        },
        create: {
          studentId: student.id,
          attendanceDate,
          checkedInAt: status !== "absent" ? checkInTime : new Date(attendanceDate),
          status,
          checkedInBy: checkedInById,
        },
      });
    }
  }

  console.log("Seeded attendance records successfully.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedAttendance()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
    });
}
