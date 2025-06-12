"use client";

import { useState } from "react";
import { AccountCard } from "@/components/accounts/AccountCard";
import { CreateAccountDialog } from "@/components/accounts/CreateAccountDialog";
import { EditAccountDialog } from "@/components/accounts/EditAccountDialog";
import { Button } from "@/components/ui/Button";
import { useAccounts } from "@/hooks/useAccounts";
import type { Account, CreateAccountInput } from "@cashbook/utils";
import { Loader2 } from "lucide-react";

export default function AccountsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);

  const {
    accounts,
    isLoading,
    error,
    createAccount,
    updateAccount,
    updateAccountStatus,
  } = useAccounts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        Failed to load accounts
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Accounts</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Create New Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts?.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onEdit={() => setEditAccount(account)}
            onStatusChange={(status) =>
              updateAccountStatus.mutate({ id: account.id, status })
            }
          />
        ))}
      </div>

      <CreateAccountDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={(data: CreateAccountInput) => {
          createAccount.mutate({ data }, {
            onSuccess: () => setIsCreateModalOpen(false),
          });
        }}
      />

      {editAccount && (
        <EditAccountDialog
          open={!!editAccount}
          onOpenChange={(open) => !open && setEditAccount(null)}
          account={editAccount}
          onSubmit={(data) => {
            updateAccount.mutate(
              { id: editAccount.id, data },
              { onSuccess: () => setEditAccount(null) }
            );
          }}
        />
      )}
    </div>
  );
}