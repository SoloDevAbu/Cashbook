import { budgetApi } from "@/services/budget";
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { Budget, CreateBudgetInput, UpdateBudgetInput } from "@cashbook/utils";
import { toast } from "sonner";
import { useState } from "react";
import { api } from "@/lib/api-client";

interface BudgetPage {
  items: Budget[];
  nextCursor: string | null;
}

type BudgetType = "credit" | "debit";

interface BudgetApiResponse {
  credit: {
    items: Budget[];
    nextCursor: string | null;
  };
  debit: {
    items: Budget[];
    nextCursor: string | null;
  };
}

async function fetchBudgetPage(
  type: BudgetType,
  filters: Record<string, string | undefined>,
  pageParam?: string
): Promise<BudgetPage> {
  // Only include filters with a value
  const params: Record<string, string> = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params[key] = value;
  });
  if (pageParam) params[`${type}Cursor`] = pageParam;

  const response = await api.get<BudgetApiResponse>('/api/budgets', { params });

  return {
    items: response.data[type].items,
    nextCursor: response.data[type].nextCursor,
  };
}

export function useBudgetsInfinite(filters: Record<string, string | undefined>) {
  const credit = useInfiniteQuery<
    { items: Budget[]; nextCursor: string | null },
    unknown
  >({
    queryKey: ["budgets", "credit", filters],
    queryFn: async ({ pageParam }) => fetchBudgetPage("credit", filters, pageParam as string),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });

  const debit = useInfiniteQuery<
    { items: Budget[]; nextCursor: string | null },
    unknown
  >({
    queryKey: ["budgets", "debit", filters],
    queryFn: async ({ pageParam }) => fetchBudgetPage("debit", filters, pageParam as string),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });

  return { credit, debit };
}

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
