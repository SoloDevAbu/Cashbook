/*
  Warnings:

  - You are about to drop the column `budgetId` on the `TransactionReceipt` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TransactionReceipt" DROP CONSTRAINT "TransactionReceipt_budgetId_fkey";

-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "transferId" TEXT;

-- AlterTable
ALTER TABLE "TransactionReceipt" DROP COLUMN "budgetId";
