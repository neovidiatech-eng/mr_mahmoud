-- AlterTable
ALTER TABLE "subscription_requests" ADD COLUMN     "subscrption_img" TEXT;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_checkedInBy_fkey" FOREIGN KEY ("checkedInBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
