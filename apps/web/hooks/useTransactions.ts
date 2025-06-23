import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { Transaction, CreateTransactionInput, UpdateTransactionInput } from "@cashbook/utils";
import { transactionsApi } from "@/services/transaction";
import { toast } from "sonner";
import { useState } from "react";
import { api } from "@/lib/api-client";

interface TransactionPage {
  items: Transaction[];
  nextCursor: string | null;
}

type TransactionType = "credit" | "debit";

interface TransactionApiResponse {
  credit: {
    items: Transaction[];
    nextCursor: string | null;
  };
  debit: {
    items: Transaction[];
    nextCursor: string | null;
  };
}

async function fetchTransactionPage(
  type: TransactionType,
  filters: Record<string, string | undefined>,
  pageParam?: string
): Promise<TransactionPage> {
  const params: Record<string, string> = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params[key] = value;
  });
  if (pageParam) params[`${type}Cursor`] = pageParam;

  const response = await api.get<TransactionApiResponse>('/api/transactions', { params });

  return {
    items: response.data[type].items,
    nextCursor: response.data[type].nextCursor,
  };
}

export function useTransactionsInfinite(filters: Record<string, string | undefined>) {
  const credit = useInfiniteQuery<
    { items: Transaction[]; nextCursor: string | null },
    unknown
  >({
    queryKey: ["transactions", "credit", filters],
    queryFn: async ({ pageParam }) => fetchTransactionPage("credit", filters, pageParam as string),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });

  const debit = useInfiniteQuery<
    { items: Transaction[]; nextCursor: string | null },
    unknown
  >({
    queryKey: ["transactions", "debit", filters],
    queryFn: async ({ pageParam }) => fetchTransactionPage("debit", filters, pageParam as string),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });

  return { credit, debit };
}

export function useTransactions() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState({});

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["transactions", params],
    queryFn: () => transactionsApi.getAll(params),
  });

  const createTransaction = useMutation({
    mutationFn: ({ data }: { data: CreateTransactionInput }) => transactionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Entity created successfully");
    },
    onError: () => {
      toast.error("Failed to create entity");
    },
  });

  const updateTransaction = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionInput }) => transactionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Entity updated successfully");
    },
    onError: () => {
      toast.error("Failed to update entity");
    },
  });

  const updateTransactionStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Transaction["status"] }) => transactionsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Entity updated successfully");
    },
    onError: () => {
      toast.error("Failed to update entity");
    },
  });

  const uploadReceipt = useMutation({
    mutationFn: ({ id, receipts }: { id: string; receipts: File[] }) => 
      transactionsApi.uploadReciept(id, receipts),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Receipts uploaded successfully");
    },
    onError: () => {
      toast.error("Failed to upload receipts");
    },
  });

  return {
    credit: data?.credit || [],
    debit: data?.debit || [],
    isLoading,
    error,
    createTransaction,
    updateTransaction,
    updateTransactionStatus,
    uploadReceipt,
    setParams,
    params,
    refetch,
  }
}