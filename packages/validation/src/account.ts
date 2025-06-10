import { z } from "zod";
import {TransactionAccountType} from "@cashbook/db";

export const createAccountSchema = z.object({
  type: z.enum([TransactionAccountType.CASH, TransactionAccountType.BANK_CREDIT, TransactionAccountType.BANK_SB, TransactionAccountType.CREDIT_CARD, TransactionAccountType.DEMAT, TransactionAccountType.LOAN, TransactionAccountType.TRADING, TransactionAccountType.UPI, TransactionAccountType.OTHER]),
  name: z.string().min(1, "Account name is required"),
  accountNumber: z.string(),
  details: z.string().optional(),
  upiLinks: z.array(z.string().url("Invalid UPI link format")).optional()
});

export const updateAccountSchema = createAccountSchema.partial();

export const updateAccountStatusSchema = z.object({
  status: z.enum(["ACTIVE", "FROZEN", "CLOSED"] as const, {
    errorMap: () => ({ message: "Invalid account status" })
  })
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
export type UpdateAccountStatusInput = z.infer<typeof updateAccountStatusSchema>;
