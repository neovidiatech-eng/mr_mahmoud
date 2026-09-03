/*
  Warnings:

  - Added the required column `endAt` to the `liveSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "liveSession" ADD COLUMN     "endAt" TIMESTAMP(3) NOT NULL;
