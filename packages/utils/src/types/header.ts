export type HeaderStatus = 'ACTIVE' | 'NOT_ACTIVE';

export interface Header {
    id: string;
    name: string;
    details?: string;
    status: HeaderStatus;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
}

export type CreateHeaderInput = Omit<Header, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'>;
export type UpdateHeaderStatusInput = Pick<Header, 'status'>;