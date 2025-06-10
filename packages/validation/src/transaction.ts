import { z } from "zod";
import { TransactionType, TransactionStatus } from "@cashbook/db";

export const createTransactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  type: z.enum([TransactionType.CREDIT, TransactionType.DEBIT]),
  details: z.string().optional(),
  transactionDate: z.string().or(z.date()),
  accountId: z.string().uuid("Invalid account ID"),
  headerId: z.string().uuid("Invalid header ID").optional(),
  tagId: z.string().uuid("Invalid tag ID").optional(),
  entityId: z.string().uuid("Invalid entity ID").optional(),
  budgetId: z.string().uuid("Invalid budget ID").optional()
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const updateTransactionStatusSchema = z.object({
  status: z.enum([TransactionStatus.COMPLETE, TransactionStatus.PENDING], {
    errorMap: () => ({ message: "Invalid transaction status" })
  })
});

export const uploadReceiptSchema = z.object({
  receipts: z.array(z.any()).min(1, "At least one receipt is required")
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type UpdateTransactionStatusInput = z.infer<typeof updateTransactionStatusSchema>;
export type UploadReceiptInput = z.infer<typeof uploadReceiptSchema>;
