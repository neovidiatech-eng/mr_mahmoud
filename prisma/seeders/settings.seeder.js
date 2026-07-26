import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function seedSettings() {
  console.log("Start seeding settings...");

  const existingSettings = await prisma.settings.findFirst();

  if (!existingSettings) {
    await prisma.settings.create({
      data: {
        userPrefix: "mr_mahmoud",
        socialLinks: {
          facebook: "https://facebook.com/mr_mahmoud",
          twitter: "https://twitter.com/mr_mahmoud",
          instagram: "https://instagram.com/mr_mahmoud",
        },
        contactInfo: {
          email: "support@mr-mahmoud.com",
          phone: "+20123456789",
          address: "Cairo, Egypt",
        },
      },
    });
    console.log("Settings seeded successfully.");
  } else {
    console.log("Settings already exist. Skipping.");
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedSettings()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
    });
}
