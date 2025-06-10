import { z } from "zod";
import { BudgetType, BudgetStatus } from "@cashbook/db";

export const createBudgetSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  type: z.enum([BudgetType.CREDIT, BudgetType.DEBIT]),
  details: z.string().optional(),
  transactionDate: z.string().or(z.date()),
  accountId: z.string().uuid("Invalid account ID"),
  headerId: z.string().uuid("Invalid header ID"),
  tagId: z.string().uuid("Invalid tag ID"),
  entityId: z.string().uuid("Invalid entity ID")
});

export const updateBudgetSchema = createBudgetSchema.partial();

export const updateBudgetStatusSchema = z.object({
  status: z.enum([
    BudgetStatus.COMPLETE_EXACT,
    BudgetStatus.COMPLETE_UNDERPAID,
    BudgetStatus.COMPLETE_OVERPAID,
    BudgetStatus.PARTIALLY_PAID,
    BudgetStatus.STALLED,
    BudgetStatus.CANCELLED,
    BudgetStatus.UNDER_PROCESS
  ], {
    errorMap: () => ({ message: "Invalid budget status" })
  })
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type UpdateBudgetStatusInput = z.infer<typeof updateBudgetStatusSchema>;
