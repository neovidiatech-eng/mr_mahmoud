/*
  Warnings:

  - A unique constraint covering the columns `[courseId,order]` on the table `quiz` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "quiz" ADD COLUMN     "courseId" TEXT,
ADD COLUMN     "order" INTEGER DEFAULT 1;

-- CreateIndex
CREATE INDEX "quiz_courseId_idx" ON "quiz"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_courseId_order_key" ON "quiz"("courseId", "order");

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
