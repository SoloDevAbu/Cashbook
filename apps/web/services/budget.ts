import { api } from "@/lib/api-client";
import { Budget, CreateBudgetInput, UpdateBudgetInput } from "@cashbook/utils";

export const budgetApi = {
  getAll: async (): Promise<Budget[]> => {
    const response = await api.get("/api/budgets");
    return response.data;
  },
  create: async (input: CreateBudgetInput): Promise<Budget> => {
    const response = await api.post("/api/budgets", input);
    return response.data;
  },
  update: async (id: string, input: UpdateBudgetInput): Promise<Budget> => {
    const response = await api.put(`/api/budgets/${id}`, input);
    return response.data;
  },
  updateStatus: async (
    id: string,
    status: Budget["status"]
  ): Promise<Budget> => {
    const response = await api.patch(`/api/budgets/${id}/status`, { status });
    return response.data;
  },
};
