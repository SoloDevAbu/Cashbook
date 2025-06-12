export type AccountStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED';
export type AccountType = 
  | 'CASH'
  | 'BANK_SB'
  | 'BANK_CREDIT'
  | 'DEMAT'
  | 'TRADING'
  | 'LOAN'
  | 'CREDIT_CARD'
  | 'UPI'
  | 'OTHER';

export interface Account {
  id: string;
  type: AccountType;
  name: string;
  accountNumber: string;
  details?: string;
  upiLinks?: string[];
  status: AccountStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateAccountInput = Omit<Account, 'id' | 'ownerId' | 'createdAt' | 'updatedAt' | 'status'>;
export type UpdateAccountInput = Partial<CreateAccountInput>;
