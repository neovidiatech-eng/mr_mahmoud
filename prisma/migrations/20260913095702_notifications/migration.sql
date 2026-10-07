/*
  Warnings:

  - You are about to drop the column `message` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "notification" DROP COLUMN "message",
DROP COLUMN "title";

-- CreateTable
CREATE TABLE "notification_translation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "lang" TEXT NOT NULL,

    CONSTRAINT "notification_translation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notification_translation" ADD CONSTRAINT "notification_translation_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
