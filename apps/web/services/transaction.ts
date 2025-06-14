import { api } from "@/lib/api-client";
import type {
  CreateTransactionInput,
  Transaction,
  UpdateTransactionInput,
} from "@cashbook/utils";

export const transactionsApi = {
  getAll: async (): Promise<Transaction[]> => {
    const response = await api.get("/api/transactions");
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
    receiptUrls: string[]
  ): Promise<Transaction> => {
    const response = await api.patch(`/api/transactions/${id}/upload`, {
      receiptUrls,
    });
    return response.data;
  },
};