import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const categories = [
  {
    title_ar: "Technical Support",
    title_en: "Technical Support",
    supports: {
      create: [
        {
          title_ar: "WhatsApp Support",
          title_en: "WhatsApp Support",
          url: "https://wa.me/1234567890",
          description_ar: "Chat with our technical team for immediate assistance.",
          description_en: "Chat with our technical team for immediate assistance.",
        },
        {
          title_ar: "System Tutorial Videos",
          title_en: "System Tutorial Videos",
          url: "https://youtube.com/playlist?list=system-tutorials",
          description_ar: "Watch videos on how to use the platform effectively.",
          description_en: "Watch videos on how to use the platform effectively.",
        },
      ],
    },
  },
  {
    title_ar: "Academic Support",
    title_en: "Academic Support",
    supports: {
      create: [
        {
          title_ar: "Teacher Handbook",
          title_en: "Teacher Handbook",
          url: "https://mr-mahmoud.com/handbook",
          description_ar: "Comprehensive guide for teachers on academic standards.",
          description_en: "Comprehensive guide for teachers on academic standards.",
        },
        {
          title_ar: "Student FAQ",
          title_en: "Student FAQ",
          url: "https://mr-mahmoud.com/faq-students",
          description_ar: "Frequently asked questions for students.",
          description_en: "Frequently asked questions for students.",
        },
      ],
    },
  },
  {
    title_ar: "Billing & Payments",
    title_en: "Billing & Payments",
    supports: {
      create: [
        {
          title_ar: "Refund Policy",
          title_en: "Refund Policy",
          url: "https://mr-mahmoud.com/refund-policy",
          description_ar: "Learn about our refund rules and procedures.",
          description_en: "Learn about our refund rules and procedures.",
        },
      ],
    },
  },
];

export async function seedSupport() {
  console.log("Start seeding support data...");

  for (const category of categories) {
    const existingCategory = await prisma.support_category.findFirst({
      where: { title_ar: category.title_ar },
    });

    if (existingCategory) {
      // Update existing category and its supports (simplified for seeding)
      await prisma.support_category.update({
        where: { id: existingCategory.id },
        data: {
          title_ar: category.title_ar,
          title_en: category.title_en,
        },
      });
      console.log(`Updated category: ${category.title_ar}`);
    } else {
      await prisma.support_category.create({
        data: category,
      });
      console.log(`Created category: ${category.title_ar}`);
    }
  }

  console.log("Seeded support data.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedSupport()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
    });
}
