/*
  Warnings:

  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - A unique constraint covering the columns `[name]` on the table `Header` will be added. If there are existing duplicate values, this will fail.
  - Made the column `headerId` on table `Budget` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tagId` on table `Budget` required. This step will fail if there are existing NULL values in that column.
  - Made the column `entityId` on table `Budget` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gst` on table `SourceDestinationEntity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pan` on table `SourceDestinationEntity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `SourceDestinationEntity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `SourceDestinationEntity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pin` on table `SourceDestinationEntity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `SourceDestinationEntity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nationalId` on table `SourceDestinationEntity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `headerId` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tagId` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `entityId` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `type` on the `TransactionAccount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `accountNumber` on table `TransactionAccount` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `companyName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pin` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pan` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nationalId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TransactionAccountType" AS ENUM ('CASH', 'BANK_SB', 'BANK_CREDIT', 'DEMAT', 'TRADING', 'LOAN', 'CREDIT_CARD', 'UPI', 'OTHER');

-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_entityId_fkey";

-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_headerId_fkey";

-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_entityId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_headerId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_tagId_fkey";

-- AlterTable
ALTER TABLE "Budget" ALTER COLUMN "headerId" SET NOT NULL,
ALTER COLUMN "tagId" SET NOT NULL,
ALTER COLUMN "entityId" SET NOT NULL;

-- AlterTable
ALTER TABLE "SourceDestinationEntity" ALTER COLUMN "gst" SET NOT NULL,
ALTER COLUMN "pan" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "pin" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "nationalId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "amount" SET DATA TYPE INTEGER,
ALTER COLUMN "headerId" SET NOT NULL,
ALTER COLUMN "tagId" SET NOT NULL,
ALTER COLUMN "entityId" SET NOT NULL;

-- AlterTable
ALTER TABLE "TransactionAccount" DROP COLUMN "type",
ADD COLUMN     "type" "TransactionAccountType" NOT NULL,
ALTER COLUMN "accountNumber" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "companyName" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "pin" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "pan" SET NOT NULL,
ALTER COLUMN "nationalId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Header_name_key" ON "Header"("name");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_headerId_fkey" FOREIGN KEY ("headerId") REFERENCES "Header"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "SourceDestinationEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_headerId_fkey" FOREIGN KEY ("headerId") REFERENCES "Header"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "SourceDestinationEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
