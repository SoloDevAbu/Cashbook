"use client";

import { Button } from "@/components/ui/Button";
import { useBudget } from "@/hooks/useBudget";
import { Budget, CreateBudgetInput } from "@cashbook/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { CreateBudgetDialog } from "@/components/budget/CreateBudgetDialog";
import { EditBudgetDialog } from "@/components/budget/EditBudgetDialog";
import { BudgetLedger } from "@/components/budget/BudgetLedger";
import { useHeaders } from "@/hooks/useHeaders";
import { useAccounts } from "@/hooks/useAccounts";
import { SelectInputWithCreate } from "@cashbook/ui";

export default function TransactionsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editBudget, setEditBudget] = useState<Budget | null>(null);

  const { accounts, isLoading: isLoadingAccounts } = useAccounts();
  const { headers, isLoading: isLoadingHeaders } = useHeaders();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [accountId, setAccountId] = useState("");
  const [headerId, setHeaderId] = useState("");
  const [search, setSearch] = useState("");

  const {
    credit,
    debit,
    isLoading,
    error,
    createBudget,
    updateBudget,
    updateBudgetStatus,
    setParams,
  } = useBudget();

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
        Failed to load Budgets
      </div>
    );
  }

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setAccountId("");
    setHeaderId("");
    setSearch("");
    setParams({
      startDate: "",
      endDate: "",
      accountId: "",
      headerId: "",
      search: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Budgets</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Create New Budget
        </Button>
      </div>
      {/*Sorting options */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-row flex-wrap items-center gap-4 w-full">
          <div className="flex flex-col gap-1 min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              className="border rounded px-2 py-1 w-full"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              max={endDate || undefined}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              className="border rounded px-2 py-1 w-full"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              min={startDate || undefined}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[180px]">
            <SelectInputWithCreate
              label="Account"
              value={accountId}
              onChange={setAccountId}
              options={accounts?.map((account) => ({ value: account.id, label: account.name })) || []}
              placeholder="Sort by Account"
              disabled={isLoadingAccounts}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[180px]">
            <SelectInputWithCreate
              label="Header"
              value={headerId}
              onChange={setHeaderId}
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
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by details or PAN"
            />
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          <Button
            onClick={() => {
              setParams({
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                accountId: accountId || undefined,
                headerId: headerId || undefined,
                search: search || undefined,
              });
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
        {credit.length > 0 && debit.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Credit Budgets</h2>
              <BudgetLedger
                budgets={credit}
                onEdit={setEditBudget}
                onStatusChange={(budget, status) => {
                  updateBudgetStatus.mutate({
                    id: budget.id,
                    status,
                  });
                }}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Debit Budgets</h2>
              <BudgetLedger
                budgets={debit}
                onEdit={setEditBudget}
                onStatusChange={(budget, status) => {
                  updateBudgetStatus.mutate({
                    id: budget.id,
                    status,
                  });
                }}
              />
            </div>
          </div>
        ) : credit.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold mb-2">Credit Budgets</h2>
            <BudgetLedger
              budgets={credit}
              onEdit={setEditBudget}
              onStatusChange={(budget, status) => {
                updateBudgetStatus.mutate({
                  id: budget.id,
                  status,
                });
              }}
            />
          </div>
        ) : debit.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold mb-2">Debit Budgets</h2>
            <BudgetLedger
              budgets={debit}
              onEdit={setEditBudget}
              onStatusChange={(budget, status) => {
                updateBudgetStatus.mutate({
                  id: budget.id,
                  status,
                });
              }}
            />
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">No budgets found.</div>
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
