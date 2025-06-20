"use client";

import { Button } from "@/components/ui/Button";
import { useBudget, useBudgetsInfinite } from "@/hooks/useBudget";
import type { Budget, CreateBudgetInput } from "@cashbook/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { CreateBudgetDialog } from "@/components/budget/CreateBudgetDialog";
import { EditBudgetDialog } from "@/components/budget/EditBudgetDialog";
import { BudgetLedgerInfinite } from "@/components/budget/BudgetLedgerInfinite";
import { useHeaders } from "@/hooks/useHeaders";
import { useAccounts } from "@/hooks/useAccounts";
import { SelectInputWithCreate } from "@cashbook/ui";

export default function TransactionsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editBudget, setEditBudget] = useState<Budget | null>(null);

  const { accounts, isLoading: isLoadingAccounts } = useAccounts();
  const { headers, isLoading: isLoadingHeaders } = useHeaders();

  const { createBudget, updateBudget, updateBudgetStatus } = useBudget();

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    accountId: "",
    headerId: "",
    search: "",
  });

  const { credit, debit } = useBudgetsInfinite(filters);

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
        Failed to load budgets
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Budgets</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Create New Budget
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row flex-wrap items-center gap-4 w-full">
          <div className="flex flex-col gap-1 min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              className="border rounded px-2 py-1 w-full"
              value={filters.startDate}
              onChange={(e) =>
                setFilters((f) => ({ ...f, startDate: e.target.value }))
              }
              max={filters.endDate || undefined}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              className="border rounded px-2 py-1 w-full"
              value={filters.endDate}
              onChange={(e) =>
                setFilters((f) => ({ ...f, endDate: e.target.value }))
              }
              min={filters.startDate || undefined}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[180px]">
            <SelectInputWithCreate
              label="Account"
              value={filters.accountId}
              onChange={(val) => setFilters((f) => ({ ...f, accountId: val }))}
              options={
                accounts?.map((account) => ({
                  value: account.id,
                  label: account.name,
                })) || []
              }
              placeholder="Sort by Account"
              disabled={isLoadingAccounts}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[180px]">
            <SelectInputWithCreate
              label="Header"
              value={filters.headerId}
              onChange={(val) => setFilters((f) => ({ ...f, headerId: val }))}
              options={
                headers?.map((header) => ({
                  value: header.id,
                  label: header.name,
                })) || []
              }
              placeholder="Sort by Header"
              disabled={isLoadingHeaders}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[200px] max-w-[350px] flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              className="border border-gray-500 rounded px-2 py-1 w-full"
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
              placeholder="Search by details or PAN"
            />
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          <Button onClick={() => setFilters({ ...filters })} className="px-6">
            Search
          </Button>
          <Button onClick={handleClear} className="px-6">
            Clear
          </Button>
        </div>
      </div>

      <div>
        {credit.data?.pages &&
        credit.data.pages.length > 0 &&
        debit.data?.pages &&
        debit.data.pages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Credit Budgets</h2>
              <BudgetLedgerInfinite
                query={credit}
                onEdit={setEditBudget}
                onStatusChange={(budget, status) => {
                  updateBudgetStatus.mutate({ id: budget.id, status });
                }}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Debit Budgets</h2>
              <BudgetLedgerInfinite
                query={debit}
                onEdit={setEditBudget}
                onStatusChange={(budget, status) => {
                  updateBudgetStatus.mutate({ id: budget.id, status });
                }}
              />
            </div>
          </div>
        ) : credit.data?.pages && credit.data.pages.length > 0 ? (
          <div className="w-full">
            <h2 className="text-lg font-semibold mb-2">Credit Budgets</h2>
            <BudgetLedgerInfinite
              query={credit}
              onEdit={setEditBudget}
              onStatusChange={(budget, status) => {
                updateBudgetStatus.mutate({ id: budget.id, status });
              }}
            />
          </div>
        ) : debit.data?.pages && debit.data.pages.length > 0 ? (
          <div className="w-full">
            <h2 className="text-lg font-semibold mb-2">Debit Budgets</h2>
            <BudgetLedgerInfinite
              query={debit}
              onEdit={setEditBudget}
              onStatusChange={(budget, status) => {
                updateBudgetStatus.mutate({ id: budget.id, status });
              }}
            />
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No budgets found.
          </div>
        )}
      </div>

      <CreateBudgetDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={(data: CreateBudgetInput) => {
          createBudget.mutate(
            { data },
            {
              onSuccess: () => {
                setIsCreateModalOpen(false);
              },
            }
          );
        }}
      />

      {editBudget && (
        <EditBudgetDialog
          open={!!editBudget}
          onOpenChange={() => setEditBudget(null)}
          budget={editBudget}
          onSubmit={(data) => {
            updateBudget.mutate(
              { id: editBudget.id, data },
              {
                onSuccess: () => {
                  setEditBudget(null);
                },
              }
            );
          }}
        />
      )}
    </div>
  );
}
