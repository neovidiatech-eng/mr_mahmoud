/*
  Warnings:

  - You are about to drop the column `rankId` on the `offlineGroup` table. All the data in the column will be lost.
  - You are about to drop the column `stageName_ar` on the `ranks` table. All the data in the column will be lost.
  - You are about to drop the column `stageName_en` on the `ranks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stageId]` on the table `offlineGroup` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stageId` to the `offlineGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "offlineGroup" DROP CONSTRAINT "offlineGroup_rankId_fkey";

-- DropIndex
DROP INDEX "offlineGroup_rankId_key";

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "stageId" TEXT;

-- AlterTable
ALTER TABLE "offlineGroup" DROP COLUMN "rankId",
ADD COLUMN     "stageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ranks" DROP COLUMN "stageName_ar",
DROP COLUMN "stageName_en";

-- AlterTable
ALTER TABLE "student" ADD COLUMN     "stageId" TEXT;

-- CreateTable
CREATE TABLE "stage" (
    "id" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "name_en" TEXT,
    "slug" TEXT NOT NULL,
    "rankId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stage_slug_key" ON "stage"("slug");

-- CreateIndex
CREATE INDEX "stage_rankId_idx" ON "stage"("rankId");

-- CreateIndex
CREATE UNIQUE INDEX "offlineGroup_stageId_key" ON "offlineGroup"("stageId");

-- AddForeignKey
ALTER TABLE "stage" ADD CONSTRAINT "stage_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "ranks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "stage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offlineGroup" ADD CONSTRAINT "offlineGroup_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "stage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "stage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
