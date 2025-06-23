"use client";

import { CreateTransactionDialog } from "@/components/transaction/CreateTransactionDialog";
import { EditTransactionDialog } from "@/components/transaction/EditTransactionDialog";
import { Button } from "@/components/ui/Button";
import { useTransactions, useTransactionsInfinite } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { useHeaders } from "@/hooks/useHeaders";
import { SelectInputWithCreate } from "@cashbook/ui";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { CreateTransactionInput, Transaction } from "@cashbook/utils";
import { TransactionLedgerInfinite } from "@/components/transaction/TransactionLedgerInfinite";

export default function TransactionsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);

  const { accounts, isLoading: isLoadingAccounts } = useAccounts();
  const { headers, isLoading: isLoadingHeaders } = useHeaders();

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    accountId: "",
    headerId: "",
    search: "",
  });
  
  const {
    createTransaction,
    updateTransaction,
    updateTransactionStatus,
  } = useTransactions();
  
  const { credit, debit } = useTransactionsInfinite(filters);

  const isLoading = credit.isLoading || debit.isLoading;
  const error = credit.error || debit.error;

  const handleClear = () => {
    setFilters({
      startDate: "",
      endDate: "",
      accountId: "",
      headerId: "",
      search: "",
    });
  };

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

      {/* Sorting options */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-row flex-wrap items-center gap-4 w-full">
          <div className="flex flex-col gap-1 min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              className="border rounded px-2 py-1 w-full"
              value={filters.startDate}
              onChange={e => setFilters({ ...filters, startDate: e.target.value })}
              max={filters.endDate || undefined}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              className="border rounded px-2 py-1 w-full"
              value={filters.endDate}
              onChange={e => setFilters({ ...filters, endDate: e.target.value })}
              min={filters.startDate || undefined}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[180px]">
            <SelectInputWithCreate
              label="Account"
              value={filters.accountId}
              onChange={val => setFilters(f => ({ ...f, accountId: val }))}
              options={accounts?.map((account) => ({ value: account.id, label: account.name })) || []}
              placeholder="Sort by Account"
              disabled={isLoadingAccounts}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[180px]">
            <SelectInputWithCreate
              label="Header"
              value={filters.headerId}
              onChange={val => setFilters(f => ({ ...f, headerId: val }))}
              options={headers?.map((header) => ({ value: header.id, label: header.name })) || []}
              placeholder="Sort by Header"
              disabled={isLoadingHeaders}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[220px] flex-1">
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              className="border border-gray-500 rounded px-2 py-1 w-full"
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search by details or PAN"
            />
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          <Button
            onClick={() => {
              credit.refetch();
              debit.refetch();
            }}
            className="px-6"
          >
            Search
          </Button>
          <Button
            onClick={handleClear}
            className="px-6"
          >
            Clear
          </Button>
        </div>
      </div>

      <div>
        {credit.data?.pages && credit.data.pages.length > 0 && debit.data?.pages && debit.data.pages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Credit Transactions</h2>
              <TransactionLedgerInfinite
                query={credit}
                onEdit={setEditTransaction}
                onStatusChange={(transaction, status) => {
                  updateTransactionStatus.mutate({
                    id: transaction.id,
                    status,
                  });
                }}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Debit Transactions</h2>
              <TransactionLedgerInfinite
                query={debit}
                onEdit={setEditTransaction}
                onStatusChange={(transaction, status) => {
                  updateTransactionStatus.mutate({
                    id: transaction.id,
                    status,
                  });
                }}
              />
            </div>
          </div>
        ) : credit.data?.pages && credit.data.pages.length > 0 ? (
          <div className="w-full">
            <h2 className="text-lg font-semibold mb-2">Credit Transactions</h2>
            <TransactionLedgerInfinite
              query={credit}
              onEdit={setEditTransaction}
              onStatusChange={(transaction, status) => {
                updateTransactionStatus.mutate({
                  id: transaction.id,
                  status,
                });
              }}
            />
          </div>
        ) : debit.data?.pages && debit.data.pages.length > 0 ? (
          <div className="w-full">
            <h2 className="text-lg font-semibold mb-2">Debit Transactions</h2>
            <TransactionLedgerInfinite
              query={debit}
              onEdit={setEditTransaction}
              onStatusChange={(transaction, status) => {
                updateTransactionStatus.mutate({
                  id: transaction.id,
                  status,
                });
              }}
            />
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">No transactions found.</div>
        )}
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
