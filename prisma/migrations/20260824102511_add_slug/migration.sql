/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `quiz` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "quiz" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "quiz_slug_key" ON "quiz"("slug");

-- CreateIndex
CREATE INDEX "quiz_slug_idx" ON "quiz"("slug");
