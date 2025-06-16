export type TransactionType = 'CREDIT' | 'DEBIT';
export type TransactionStatus = 'PENDING' | 'COMPLETE';

export interface Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    details: string;
    transferId: string;
    status: TransactionStatus;
    transactionDate: string;
    receipts: TransactionReceipt[];
    accountId: string;
    headerId: string;
    tagId: string;
    entityId: string;
    budgetId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface TransactionReceipt {
    id: string;
    blobName: string;
    container: string;
    mimeType: string;
    size: number;
    originalName: string;
    receiptUploadedAt: string;
    signedUrl: string;
    transactionId?: string;
    budgetId?: string;
    createdAt: string;
    updatedAt: string;
}

export type CreateTransactionInput = Omit<Transaction, 'id' | 'blobName' | 'container' | 'mimeType' | 'size' | 'receiptUploadedAt' | 'createdAt' | 'updatedAt'>;
export type UpdateTransactionInput = Partial<CreateTransactionInput>;