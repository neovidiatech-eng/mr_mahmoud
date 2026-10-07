/*
  Warnings:

  - You are about to drop the column `instaPay` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `vodafoneCash` on the `settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "settings" DROP COLUMN "instaPay",
DROP COLUMN "vodafoneCash",
ADD COLUMN     "paymentMethods" JSONB;
