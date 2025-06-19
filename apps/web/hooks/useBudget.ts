import { budgetApi } from "@/services/budget";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Budget, CreateBudgetInput, UpdateBudgetInput } from "@cashbook/utils";
import { toast } from "sonner";
import { useState } from "react";

export function useBudget() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState({});

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["budgets", params],
    queryFn: () => budgetApi.getAll(params),
  });

  const createBudget = useMutation({
    mutationFn: ({ data }: { data: CreateBudgetInput }) =>
      budgetApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Budget created successfully");
    },
    onError: () => {
      toast.error("Failed to create budget");
    },
  });

  const updateBudget = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetInput }) =>
      budgetApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Budget updated successfully");
    },
    onError: () => {
      toast.error("Failed to update budget");
    },
  });

  const updateBudgetStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Budget["status"] }) =>
      budgetApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Budget status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update budget status");
    },
  });

  return {
    credit: data?.credit || [],
    debit: data?.debit || [],
    isLoading,
    error,
    createBudget,
    updateBudget,
    updateBudgetStatus,
    setParams,
    params,
    refetch,
  };
}
