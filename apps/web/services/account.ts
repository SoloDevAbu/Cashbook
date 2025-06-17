import { api } from '@/lib/api-client';
import type { Account, CreateAccountInput, UpdateAccountInput } from '@cashbook/utils';

export const accountsApi = {
    getAll: async() : Promise<Account[]> => {
        const response = await api.get('/api/accounts');
        return response.data;
    },

    create: async (input: CreateAccountInput) : Promise<Account> => {
        const response = await api.post('/api/accounts', input);
        return response.data;
    },

    update: async (id: string, input: UpdateAccountInput) : Promise<Account> => {
        const response = await api.put(`/api/accounts/${id}`, input);
        return response.data;
    },

    updateStatus: async (id: string, status: Account['status']) : Promise<Account> => {
        const response = await api.patch(`/api/accounts/${id}/status`, { status });
        return response.data;
    },
}