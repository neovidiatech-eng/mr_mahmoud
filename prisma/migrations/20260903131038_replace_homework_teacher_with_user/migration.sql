/*
  Warnings:

  - You are about to drop the column `teacherId` on the `homework` table. All the data in the column will be lost.
  - Added the required column `userId` to the `homework` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "homework" DROP CONSTRAINT "homework_teacherId_fkey";

-- DropIndex
DROP INDEX "homework_teacherId_idx";

-- AlterTable
ALTER TABLE "homework" DROP COLUMN "teacherId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "homework_userId_idx" ON "homework"("userId");

-- AddForeignKey
ALTER TABLE "homework" ADD CONSTRAINT "homework_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
