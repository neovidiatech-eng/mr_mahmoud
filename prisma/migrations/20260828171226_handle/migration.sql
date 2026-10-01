/*
  Warnings:

  - You are about to drop the column `pdfUrl` on the `lectures` table. All the data in the column will be lost.
  - You are about to drop the column `slidesUrl` on the `lectures` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `lectures` table. All the data in the column will be lost.
  - You are about to drop the column `ageRange` on the `ranks` table. All the data in the column will be lost.
  - You are about to drop the column `pdfUrl` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `slidesUrl` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `schedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lectures" DROP COLUMN "pdfUrl",
DROP COLUMN "slidesUrl",
DROP COLUMN "videoUrl",
ADD COLUMN     "pdf_path" TEXT,
ADD COLUMN     "slides_path" TEXT,
ADD COLUMN     "video_path" TEXT;

-- AlterTable
ALTER TABLE "ranks" DROP COLUMN "ageRange",
ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "schedule" DROP COLUMN "pdfUrl",
DROP COLUMN "slidesUrl",
DROP COLUMN "videoUrl",
ADD COLUMN     "pdf_path" TEXT,
ADD COLUMN     "slides_path" TEXT,
ADD COLUMN     "video_path" TEXT;
