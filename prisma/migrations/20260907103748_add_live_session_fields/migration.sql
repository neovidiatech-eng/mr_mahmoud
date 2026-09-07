/*
  Warnings:

  - You are about to drop the column `courseId` on the `liveSession` table. All the data in the column will be lost.
  - Added the required column `planId` to the `liveSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "liveSession" DROP CONSTRAINT "liveSession_courseId_fkey";

-- AlterTable
ALTER TABLE "liveSession" DROP COLUMN "courseId",
ADD COLUMN     "planId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "plan" ADD COLUMN     "liveSessionsCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "student" ADD COLUMN     "attendedLiveSessions" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "liveSessionAttendances" (
    "id" TEXT NOT NULL,
    "liveSessionId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "liveSessionAttendances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "liveSessionAttendances_liveSessionId_idx" ON "liveSessionAttendances"("liveSessionId");

-- CreateIndex
CREATE INDEX "liveSessionAttendances_studentId_idx" ON "liveSessionAttendances"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "liveSessionAttendances_liveSessionId_studentId_key" ON "liveSessionAttendances"("liveSessionId", "studentId");

-- AddForeignKey
ALTER TABLE "liveSession" ADD CONSTRAINT "liveSession_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liveSessionAttendances" ADD CONSTRAINT "liveSessionAttendances_liveSessionId_fkey" FOREIGN KEY ("liveSessionId") REFERENCES "liveSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liveSessionAttendances" ADD CONSTRAINT "liveSessionAttendances_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
