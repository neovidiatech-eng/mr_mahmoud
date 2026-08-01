/*
  Warnings:

  - You are about to drop the column `createdAt` on the `CoursePurchase` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `courses` table. All the data in the column will be lost.
  - The `price` column on the `courses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `title` on the `exam` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `exam_option` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `exam_option` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `exam_question` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `homework` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `homework` table. All the data in the column will be lost.
  - The `grade` column on the `homework` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `content` on the `lectures` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `lectures` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `policy` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `policy` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `policy_notice` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `policy_notice` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ranks` table. All the data in the column will be lost.
  - You are about to drop the column `stageName` on the `ranks` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `subject` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `support` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `support` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `support_category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title_ar]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_ar]` on the table `ranks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `TeacherSubject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_ar` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `exam_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_ar` to the `subject` table without a default value. This is not possible if the table is not empty.
  - Made the column `lastPosition` on table `user_lectures` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "category_name_key";

-- DropIndex
DROP INDEX "courses_title_key";

-- DropIndex
DROP INDEX "ranks_name_idx";

-- DropIndex
DROP INDEX "ranks_name_key";

-- DropIndex
DROP INDEX "schedule_status_idx";

-- DropIndex
DROP INDEX "subject_name_key";

-- AlterTable
ALTER TABLE "CoursePurchase" DROP COLUMN "createdAt",
ADD COLUMN     "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TeacherSubject" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "category" DROP COLUMN "name",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#6366f1',
ADD COLUMN     "name_ar" TEXT NOT NULL,
ADD COLUMN     "name_en" TEXT;

-- AlterTable
ALTER TABLE "course_purchase_request" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "description_ar" TEXT,
ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "title_ar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title_en" TEXT,
DROP COLUMN "price",
ADD COLUMN     "price" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "exam" DROP COLUMN "title",
ADD COLUMN     "title_ar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title_en" TEXT;

-- AlterTable
ALTER TABLE "exam_answer" ADD COLUMN     "isCorrect" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "exam_option" DROP COLUMN "createdAt",
DROP COLUMN "text",
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "text_ar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "text_en" TEXT;

-- AlterTable
ALTER TABLE "exam_question" DROP COLUMN "text",
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "points" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN     "text_ar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "text_en" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'mcq';

-- AlterTable
ALTER TABLE "homework" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "description_ar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "title_ar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title_en" TEXT,
DROP COLUMN "grade",
ADD COLUMN     "grade" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "lectures" DROP COLUMN "content",
DROP COLUMN "title",
ADD COLUMN     "content_ar" TEXT,
ADD COLUMN     "content_en" TEXT,
ADD COLUMN     "title_ar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title_en" TEXT;

-- AlterTable
ALTER TABLE "policy" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "description_ar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "title_ar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title_en" TEXT;

-- AlterTable
ALTER TABLE "policy_notice" DROP COLUMN "content",
DROP COLUMN "title",
ADD COLUMN     "content_ar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "content_en" TEXT,
ADD COLUMN     "title_ar" TEXT NOT NULL DEFAULT 'تنبيه هام',
ADD COLUMN     "title_en" TEXT DEFAULT 'Important Notice';

-- AlterTable
ALTER TABLE "ranks" DROP COLUMN "name",
DROP COLUMN "stageName",
ADD COLUMN     "name_ar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "name_en" TEXT,
ADD COLUMN     "stageName_ar" TEXT,
ADD COLUMN     "stageName_en" TEXT;

-- AlterTable
ALTER TABLE "subject" DROP COLUMN "name",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#10b981',
ADD COLUMN     "name_ar" TEXT NOT NULL,
ADD COLUMN     "name_en" TEXT;

-- AlterTable
ALTER TABLE "support" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "description_ar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "title_ar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title_en" TEXT;

-- AlterTable
ALTER TABLE "support_category" DROP COLUMN "title",
ADD COLUMN     "title_ar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title_en" TEXT;

-- AlterTable
ALTER TABLE "user_lectures" ALTER COLUMN "lastPosition" SET NOT NULL,
ALTER COLUMN "lastPosition" SET DEFAULT 0,
ALTER COLUMN "lastPosition" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "post" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title_ar" TEXT NOT NULL,
    "title_en" TEXT,
    "slug" TEXT NOT NULL,
    "excerpt_ar" TEXT,
    "excerpt_en" TEXT,
    "content_ar" TEXT NOT NULL,
    "content_en" TEXT,
    "coverImage" TEXT,
    "authorId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "readingCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "post_slug_key" ON "post"("slug");

-- CreateIndex
CREATE INDEX "post_type_idx" ON "post"("type");

-- CreateIndex
CREATE INDEX "post_published_idx" ON "post"("published");

-- CreateIndex
CREATE INDEX "post_slug_idx" ON "post"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "courses_title_ar_key" ON "courses"("title_ar");

-- CreateIndex
CREATE INDEX "courses_title_ar_idx" ON "courses"("title_ar");

-- CreateIndex
CREATE UNIQUE INDEX "ranks_name_ar_key" ON "ranks"("name_ar");

-- CreateIndex
CREATE INDEX "ranks_name_ar_idx" ON "ranks"("name_ar");

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
