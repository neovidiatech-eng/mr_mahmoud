-- AlterTable
ALTER TABLE "student" ADD COLUMN     "liveSessionsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "liveSessionsRemaining" INTEGER NOT NULL DEFAULT 0;
