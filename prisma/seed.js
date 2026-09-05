import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";
import { seedCurrencies } from "./seeders/currency.seeder.js";
import { seedPlans } from "./seeders/plans.seeder.js";
import { seedPermissions } from "./seeders/permissionsSeeder.js";
import { seedStuff } from "./seeders/stuff.seeder.js";
import { seedTeachers } from "./seeders/teachers.seeder.js";
import { seedStudents } from "./seeders/student.seeder.js";
import { seedSchedules } from "./seeders/schedules.seeder.js";
import { seedSubscriptionRequests } from "./seeders/subscriptionRequests.seeder.js";
import { seedExpenses } from "./seeders/expenses.seeder.js";
import { seedSubscriptions } from "./seeders/subscriptions.seeder.js";
import { seedSystemWallet } from "./seeders/systemWallet.seeder.js";
import { seedRequests } from "./seeders/requests.seeder.js";
import { seedMatrials } from "./seeders/matrials.seeder.js";
import { seedStages } from "./seeders/stages.seeder.js";
import { seedSettings } from "./seeders/settings.seeder.js";
import { seedPolicies } from "./seeders/policies.seeder.js";
import { seedProgress } from "./seeders/progress.seeder.js";
import { seedSupport } from "./seeders/support.seeder.js";
import { seedHomework } from "./seeders/homework.seeder.js";
import { seedExams } from "./seeders/exams.seeder.js";
import { seedQuizzes } from "./seeders/quiz.seeder.js";
import { seedStudentQuizzes } from "./seeders/studentQuiz.seeder.js";
import { seedSections } from "./seeders/sections.seeder.js";
import { seedChat } from "./seeders/chat.seeder.js";
import { seedWeeklyReports } from "./seeders/weeklyReports.seeder.js";
import { seedWithdrawals } from "./seeders/withdrawals.seeder.js";
import { seedCoursePurchaseRequests } from "./seeders/coursePurchaseRequests.seeder.js";
import { seedTransactions } from "./seeders/transactions.seeder.js";
import { seedAttendance } from "./seeders/attendance.seeder.js";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("--- Starting Global Module Seeding ---");

  await seedCurrencies();
  await seedSettings();
  await seedMatrials();
  await seedStages();
  await seedPlans();
  await seedPermissions();
  await seedStuff();
  await seedTeachers();
  await seedStudents();
  await seedAttendance();
  await seedSubscriptions();
  await seedSubscriptionRequests();
  await seedSchedules();
  await seedExpenses();
  await seedSystemWallet();
  await seedRequests();
  await seedPolicies();
  await seedProgress();
  await seedSupport();
  await seedHomework();
  await seedExams();
  await seedQuizzes();
  await seedStudentQuizzes();
  await seedSections();
  await seedChat();
  await seedWeeklyReports();
  await seedWithdrawals();
  await seedCoursePurchaseRequests();
  await seedTransactions();

  console.log("--- All Modules Seeded Finished Successfully ---");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
