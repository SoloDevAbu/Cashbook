"use client";

import { CreateTransactionDialog } from "@/components/transaction/CreateTransactionDialog";
import { EditTransactionDialog } from "@/components/transaction/EditTransactionDialog";
import { TransactionCard } from "@/components/transaction/TransactionCard";
import { Button } from "@/components/ui/Button";
import { useTransactions } from "@/hooks/useTransactions";
import {
  Transaction,
  CreateTransactionInput,
} from "@cashbook/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function TransactionsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);

  const {
    transactions,
    isLoading,
    error,
    createTransaction,
    updateTransaction,
    updateTransactionStatus,
  } = useTransactions();

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
        Failed to load transactions
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Create New Transaction
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transactions?.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            onEdit={() => setEditTransaction(transaction)}
            onStatusChange={(status) => {
              updateTransactionStatus.mutate({
                id: transaction.id,
                status,
              });
            }}
          />
        ))}
      </div>

      <CreateTransactionDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={(data: CreateTransactionInput) => {
          createTransaction.mutate(
            { data },
            {
              onSuccess: () => {
                setIsCreateModalOpen(false);
              },
            }
          );
        }}
      />

      {editTransaction && (
        <EditTransactionDialog
          open={!!editTransaction}
          onOpenChange={() => setEditTransaction(null)}
          transaction={editTransaction}
          onSubmit={(data) => {
            updateTransaction.mutate(
              { id: editTransaction.id, data },
              {
                onSuccess: () => {
                  setEditTransaction(null);
                },
              }
            );
          }}
        />
      )}
    </div>
  );
}
