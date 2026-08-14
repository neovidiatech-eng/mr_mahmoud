/*
  Warnings:

  - A unique constraint covering the columns `[qrToken]` on the table `student` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TeacherSubject" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "category" ALTER COLUMN "name_en" DROP DEFAULT;

-- AlterTable
ALTER TABLE "exam_answer" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "student" ADD COLUMN     "qrToken" TEXT,
ADD COLUMN     "type" TEXT DEFAULT 'online';

-- CreateIndex
CREATE UNIQUE INDEX "student_qrToken_key" ON "student"("qrToken");
