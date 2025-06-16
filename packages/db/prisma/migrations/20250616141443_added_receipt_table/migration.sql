/*
  Warnings:

  - You are about to drop the column `receiptUrls` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "receiptUrls";

-- CreateTable
CREATE TABLE "TransactionReceipt" (
    "id" TEXT NOT NULL,
    "blobName" TEXT NOT NULL,
    "container" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "originalName" TEXT NOT NULL,
    "receiptUploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionId" TEXT,
    "budgetId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionReceipt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransactionReceipt" ADD CONSTRAINT "TransactionReceipt_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionReceipt" ADD CONSTRAINT "TransactionReceipt_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
