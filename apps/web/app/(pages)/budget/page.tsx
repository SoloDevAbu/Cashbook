"use client";

import { Button } from "@/components/ui/Button";
import { useBudget } from "@/hooks/useBudget";
import {
  Budget,
  CreateBudgetInput,
} from "@cashbook/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { BudgetCard } from "@/components/budget/BudgetCard";
import { CreateBudgetDialog } from "@/components/budget/CreateBudgetDialog";
import { EditBudgetDialog } from "@/components/budget/EditBudgetDialog";

export default function TransactionsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editBudget, setEditBudget] = useState<Budget | null>(null);

  const {
    budgets,
    isLoading,
    error,
    createBudget,
    updateBudget,
    updateBudgetStatus,
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Budgets</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Create New Budget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets?.map((budget) => (
          <BudgetCard
            key={budget.id}
            budget={budget}
            onEdit={() => setEditBudget(budget)}
            onStatusChange={(status) => {
              updateBudgetStatus.mutate({
                id: budget.id,
                status,
              });
            }}
          />
        ))}
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
