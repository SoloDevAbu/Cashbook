export type BudgetStatus =
  | "COMPLETE_EXACT"
  | "COMPLETE_UNDERPAID"
  | "COMPLETE_OVERPAID"
  | "PARTIALLY_PAID"
  | "STALLED"
  | "CANCELLED"
  | "UNDER_PROCESS";

  export type BudgetType = 'CREDIT' | 'DEBIT';

  export interface Budget {
    id: string;
    amount: number;
    type: BudgetType;
    details?: string;
    transferId?: string;
    status: BudgetStatus;
    transactionDate: string;
    accountId: string;
    headerId: string;
    tagId: string;
    entityId: string;
    createdAt: string;
    updatedAt: string;
  }

  export type CreateBudgetInput = Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>;
  export type UpdateBudgetInput = Partial<CreateBudgetInput>