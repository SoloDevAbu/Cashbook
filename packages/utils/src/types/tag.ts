export interface Tag {
    id: string;
    name: string;
    details?: string;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
}

export type CreateTagInput = Omit<Tag, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'>;