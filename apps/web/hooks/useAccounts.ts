import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsApi } from "@/services/account";
import type {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
} from "@cashbook/utils";
import { toast } from "sonner";

export function useAccounts() {
  const queryClient = useQueryClient();

  const {
    data: accounts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: accountsApi.getAll,
  });

  const createAccount = useMutation({
    mutationFn: ({ data } : { data: CreateAccountInput }) => accountsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Account created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create account");
    },
  });

  const updateAccount = useMutation({
    mutationFn: ({ id, data}: {id: string, data: UpdateAccountInput}) => accountsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Account updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update account");
    },
  });

  const updateAccountStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Account["status"] }) => accountsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Account status updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update account status");
    },
  });
  return {
      accounts,
      isLoading,
      error,
      createAccount,
      updateAccount,
      updateAccountStatus,
  }
}

