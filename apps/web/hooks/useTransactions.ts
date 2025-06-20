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
    transactions,
    isLoading,
    error,
    createTransaction,
    updateTransaction,
    updateTransactionStatus,
    uploadReceipt,
  }

}