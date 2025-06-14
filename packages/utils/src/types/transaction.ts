export type TransactionType = 'CREDIT' | 'DEBIT';
export type TransactionStatus = 'PENDING' | 'COMPLETE';

export interface Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    details: string;
    transferId: string;
    status: TransactionStatus;
    receiptUrls?: string[];
    transactionDate: string;
    accountId: string;
    headerId: string;
    tagId: string;
    entityId: string;
    budgetId?: string;
    createdAt: string;
    updatedAt: string;
}

export type CreateTransactionInput = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTransactionInput = Partial<CreateTransactionInput>;