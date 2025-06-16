import { z } from "zod";
import { TransactionType, TransactionStatus } from "@cashbook/db";

export const createTransactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  type: z.enum([TransactionType.CREDIT, TransactionType.DEBIT]),
  details: z.string(),
  transferId: z.string(),
  status: z.enum([TransactionStatus.PENDING, TransactionStatus.COMPLETE]),
  receipts: z.any().optional(),
  transactionDate: z.string(),
  accountId: z.string().uuid("Invalid account ID"),
  headerId: z.string().uuid("Invalid header ID"),
  tagId: z.string().uuid("Invalid tag ID"),
  entityId: z.string().uuid("Invalid entity ID"),
  budgetId: z.string().uuid("Invalid budget ID").optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const updateTransactionStatusSchema = z.object({
  status: z.enum([TransactionStatus.COMPLETE, TransactionStatus.PENDING], {
    errorMap: () => ({ message: "Invalid transaction status" })
  })
});

export const uploadReceiptSchema = z.object({
  receipts: z.array(
    z.object({
      originalname: z.string(),
      buffer: z.instanceof(Buffer),
      mimetype: z.string(),
      size: z.number()
    })
  ).min(1, "At least one receipt is required")
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type UpdateTransactionStatusInput = z.infer<typeof updateTransactionStatusSchema>;
export type UploadReceiptInput = z.infer<typeof uploadReceiptSchema>;
