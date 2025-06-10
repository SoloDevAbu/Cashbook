/*
  Warnings:

  - Changed the type of `type` on the `Budget` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Budget` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Header` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `TransactionAccount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionAccountStatus" AS ENUM ('ACTIVE', 'FROZEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "HeaderStatus" AS ENUM ('ACTIVE', 'NOT_ACTIVE');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('COMPLETE', 'PENDING');

-- CreateEnum
CREATE TYPE "BudgetType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "BudgetStatus" AS ENUM ('COMPLETE_EXACT', 'COMPLETE_UNDERPAID', 'COMPLETE_OVERPAID', 'PARTIALLY_PAID', 'STALLED', 'CANCELLED', 'UNDER_PROCESS');

-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "type",
ADD COLUMN     "type" "BudgetType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "BudgetStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Header" DROP COLUMN "status",
ADD COLUMN     "status" "HeaderStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "type",
ADD COLUMN     "type" "TransactionType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TransactionStatus" NOT NULL;

-- AlterTable
ALTER TABLE "TransactionAccount" DROP COLUMN "status",
ADD COLUMN     "status" "TransactionAccountStatus" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL;
