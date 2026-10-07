/*
  Warnings:

  - You are about to drop the column `active` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `teacher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "student" DROP COLUMN "active",
DROP COLUMN "status";

-- AlterTable
ALTER TABLE "teacher" DROP COLUMN "active";
