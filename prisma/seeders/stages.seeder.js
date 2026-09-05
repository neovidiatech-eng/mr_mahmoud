import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const stagesData = [
  {
    rankSlug: "silver",
    stages: [
      { name_ar: "الصف الأول الإعدادي", name_en: "First Preparatory Grade", slug: "first-preparatory" },
      { name_ar: "الصف الثاني الإعدادي", name_en: "Second Preparatory Grade", slug: "second-preparatory" },
      { name_ar: "الصف الثالث الإعدادي", name_en: "Third Preparatory Grade", slug: "third-preparatory" },
    ],
  },
  {
    rankSlug: "gold",
    stages: [
      { name_ar: "الصف الأول الثانوي", name_en: "First Secondary Grade", slug: "first-secondary" },
      { name_ar: "الصف الثاني الثانوي", name_en: "Second Secondary Grade", slug: "second-secondary" },
      { name_ar: "الصف الثالث الثانوي", name_en: "Third Secondary Grade", slug: "third-secondary" },
    ],
  },
  {
    rankSlug: "platinum",
    stages: [
      { name_ar: "المرحلة المتقدمة الأولى", name_en: "First Advanced Stage", slug: "first-advanced" },
      { name_ar: "المرحلة المتقدمة الثانية", name_en: "Second Advanced Stage", slug: "second-advanced" },
    ],
  },
  {
    rankSlug: "titan",
    stages: [
      { name_ar: "مرحلة التيتان الأولى", name_en: "First Titan Stage", slug: "first-titan" },
      { name_ar: "مرحلة التيتان الثانية", name_en: "Second Titan Stage", slug: "second-titan" },
    ],
  },
];

export async function seedStages() {
  console.log("Start seeding stages...");

  for (const group of stagesData) {
    let rank = await prisma.ranks.findUnique({
      where: { slug: group.rankSlug },
    });

    if (!rank) {
      console.log(`Rank with slug '${group.rankSlug}' not found. Creating fallback rank...`);
      rank = await prisma.ranks.create({
        data: {
          name_ar: group.rankSlug.toUpperCase(),
          name_en: group.rankSlug.toUpperCase(),
          slug: group.rankSlug,
          color: "#6366f1",
        },
      });
    }

    for (const stg of group.stages) {
      const seeded = await prisma.stage.upsert({
        where: { slug: stg.slug },
        update: {
          name_ar: stg.name_ar,
          name_en: stg.name_en,
          rankId: rank.id,
        },
        create: {
          name_ar: stg.name_ar,
          name_en: stg.name_en,
          slug: stg.slug,
          rankId: rank.id,
        },
      });
      console.log(`Seeded stage: ${seeded.name_ar} (${seeded.slug})`);
    }
  }

  console.log("Seeded stages successfully.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedStages()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
    });
}
