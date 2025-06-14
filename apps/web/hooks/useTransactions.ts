import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Transaction, CreateTransactionInput, UpdateTransactionInput } from "@cashbook/utils";
import { transactionsApi } from "@/services/transaction";
import { toast } from "sonner";

export function useTransactions() {
  const queryClient = useQueryClient();

    const {
    data: transactions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: transactionsApi.getAll
  });

  const createTransaction = useMutation({
    mutationFn: ({ data }: { data: CreateTransactionInput }) => transactionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Entity created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create entity");
    },
  });

  const updateTransaction = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionInput }) => transactionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Entity updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update entity");
    },
  });

  const updateTransactionStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Transaction["status"] }) => transactionsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Entity updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update entity");
    },
  });

  const uploadReceipt = useMutation({
    mutationFn: ({ id, receiptUrls }: { id: string; receiptUrls: string[] }) => transactionsApi.uploadReciept(id, receiptUrls),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Entity updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update entity");
    },
  });

  return {
    transactions,
    isLoading,
    error,
    createTransaction,
    updateTransaction,
    updateTransactionStatus,
    uploadReceipt,
  }

}