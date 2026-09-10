import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function seedLiveSessions() {
  console.log("Start seeding live sessions...");

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { teacher: { isNot: null } },
        { role: { name: "admin" } },
        { role: { name: "super_admin" } },
      ],
    },
  });

  if (!user) {
    console.warn("No suitable teacher/user found. Skipping live sessions seeding.");
    return;
  }

  const plans = await prisma.plan.findMany({ select: { id: true } });
  const stages = await prisma.stage.findMany({ select: { id: true, name_ar: true } });

  if (plans.length === 0 || stages.length === 0) {
    console.warn("Plans or Stages not found. Skipping live sessions seeding.");
    return;
  }

  const now = new Date();
  
  // Future dates for upcoming sessions
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(18, 0, 0, 0);

  const inThreeDays = new Date(now);
  inThreeDays.setDate(inThreeDays.getDate() + 3);
  inThreeDays.setHours(20, 0, 0, 0);

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(16, 0, 0, 0);

  // Past date
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(17, 0, 0, 0);

  const sampleLiveSessions = [
    {
      title: "مراجعة شمولية على الباب الأول - Math",
      startAt: tomorrow,
      status: "scheduled",
      roomName: "live-session-math-rev-1",
    },
    {
      title: "جلسة أسئلة وإجابات مباشرة - Physics",
      startAt: inThreeDays,
      status: "scheduled",
      roomName: "live-session-physics-qna-2",
    },
    {
      title: "شرح مفاهيم الكيمياء العضوية - Chemistry",
      startAt: nextWeek,
      status: "scheduled",
      roomName: "live-session-chem-org-3",
    },
    {
      title: "لايف تفاعلي منتهي - English",
      startAt: yesterday,
      endAt: new Date(yesterday.getTime() + 60 * 60 * 1000),
      status: "ended",
      roomName: "live-session-english-past-4",
    },
  ];

  for (let i = 0; i < sampleLiveSessions.length; i++) {
    const session = sampleLiveSessions[i];
    const plan = plans[i % plans.length];
    const stage = stages[i % stages.length];

    await prisma.liveSession.upsert({
      where: { roomName: session.roomName },
      update: {
        title: session.title,
        startAt: session.startAt,
        endAt: session.endAt || null,
        status: session.status,
        planId: plan.id,
        stageId: stage.id,
        userId: user.id,
      },
      create: {
        title: session.title,
        roomName: session.roomName,
        startAt: session.startAt,
        endAt: session.endAt || null,
        status: session.status,
        planId: plan.id,
        stageId: stage.id,
        userId: user.id,
      },
    });
    console.log(`Seeded live session: "${session.title}" for stage: "${stage.name_ar}"`);
  }

  console.log("Seeded live sessions successfully.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedLiveSessions()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
    });
}
