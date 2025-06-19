import { api } from "@/lib/api-client";
import type {
  CreateTransactionInput,
  Transaction,
  UpdateTransactionInput,
} from "@cashbook/utils";

export const transactionsApi = {
  getAll: async (params = {}): Promise<{ credit: Transaction[]; debit: Transaction[] }> => {
    const response = await api.get("/api/transactions", { params });
    return response.data;
  },
  create: async (
    input: CreateTransactionInput
  ): Promise<Transaction> => {
    const response = await api.post("/api/transactions", input);
    return response.data;
  },
  update: async (
    id: string,
    input: UpdateTransactionInput
  ): Promise<Transaction> => {
    const response = await api.put(`/api/transactions/${id}`, input);
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: Transaction["status"]
  ): Promise<Transaction> => {
    const response = await api.patch(`/api/transactions/${id}/status`, {
      status,
    });
    return response.data;
  },

  uploadReciept: async (
    id: string,
    files: File[]
  ): Promise<Transaction> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('receipts', file);
    });

    const response = await api.post(`/api/transactions/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};