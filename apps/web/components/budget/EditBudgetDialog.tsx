'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { updateBudgetSchema, type UpdateBudgetInput } from '@cashbook/validation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { useAccounts } from '@/hooks/useAccounts';
import { useTags } from '@/hooks/useTags';
import { useHeaders } from '@/hooks/useHeaders';
import { useSourceDestinations } from '@/hooks/useSourceDestinatio';
import { SelectInputWithCreate } from '@cashbook/ui';
import { format } from 'date-fns';
import type { Budget, BudgetStatus, BudgetType } from '@cashbook/utils';
import { CreateAccountDialog } from '@/components/accounts/CreateAccountDialog';
import { CreateHeaderDialog } from '@/components/headers/CreateHeaderDialog';
import { CreateTagDialog } from '@/components/tags/CreateTagDialog';
import { CreateSourceDestinationDialog } from '@/components/source-destination/CreateSourceDestinationDialog';
import { useEntityCreateHandlers } from '@/hooks/useEntityCreateHandler';

interface EditBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UpdateBudgetInput) => void;
  budget: Budget;
}

export function EditBudgetDialog({ open, onOpenChange, onSubmit, budget }: EditBudgetDialogProps) {
  const { accounts, isLoading: isLoadingAccounts } = useAccounts();
  const { tags, isLoading: isLoadingTags } = useTags();
  const { headers, isLoading: isLoadingHeaders } = useHeaders();
  const { sourceDestinations, isLoading: isLoadingSourceDestinations } = useSourceDestinations();

  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [isCreateHeaderOpen, setIsCreateHeaderOpen] = useState(false);
  const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);
  const [isCreateSourceDestinationOpen, setIsCreateSourceDestinationOpen] = useState(false);
  const {
    handleCreateAccount,
    handleCreateHeader,
    handleCreateTag,
    handleCreateSourceDestination,
  } = useEntityCreateHandlers();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<UpdateBudgetInput>({
    resolver: zodResolver(updateBudgetSchema),
    defaultValues: {
      amount: budget.amount,
      type: budget.type,
      details: budget.details,
      transferId: budget.transferId,
      status: budget.status,
      transactionDate: format(new Date(budget.transactionDate), 'yyyy-MM-dd'),
      accountId: budget.accountId,
      headerId: budget.headerId,
      tagId: budget.tagId,
      entityId: budget.entityId,
    },
  });

  const handleFormSubmit = async (data: UpdateBudgetInput) => {
    try {
      await onSubmit(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-0 shadow-lg overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out">
            <div className="flex flex-col max-h-[85vh]">
              <div className="px-6 pt-6">
                <Dialog.Title className="text-2xl font-bold">Edit Budget</Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-gray-600">
                  Update budget details
                </Dialog.Description>
              </div>
              <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
                <form
                  id="edit-budget-form"
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="space-y-4"
                >
                  <Input
                    label="Amount"
                    type="number"
                    {...register("amount", { valueAsNumber: true })}
                    error={errors.amount?.message}
                  />

                  <SelectInputWithCreate
                    label="Budget Type"
                    value={watch("type")}
                    onChange={(value) => setValue("type", value as BudgetType)}
                    error={errors.type?.message}
                    options={[
                      { value: "CREDIT", label: "Credit" },
                      { value: "DEBIT", label: "Debit" },
                    ]}
                    placeholder="Select Transaction Type"
                  />

                  <Input
                    label="Details"
                    type="text"
                    {...register("details")}
                    error={errors.details?.message}
                  />

                  <Input
                    label="PAN"
                    type="text"
                    {...register("transferId")}
                    error={errors.transferId?.message}
                  />

                  <SelectInputWithCreate
                    label="Status"
                    value={watch("status")}
                    onChange={(value) =>
                      setValue("status", value as BudgetStatus)
                    }
                    error={errors.status?.message}
                    options={[
                      { value: "UNDER_PROCESS", label: "Under Process" },
                      { value: "COMPLETE_EXACT", label: "Completed" },
                      {
                        value: "COMPLETE_UNDERPAID",
                        label: "Complete(Under paid)",
                      },
                      {
                        value: "COMPLETE_OVERPAID",
                        label: "Complete(Over paid)",
                      },
                      { value: "PARTIALLY_PAID", label: "Partially Paid" },
                      { value: "STALLED", label: "Stalled" },
                      { value: "CANCELLED", label: "Cancelled" },
                    ]}
                    placeholder="Select Status"
                  />

                  <Input
                    label="Transaction Date"
                    type="date"
                    {...register("transactionDate")}
                    error={errors.transactionDate?.message}
                  />

                  <SelectInputWithCreate
                    label="Account"
                    value={watch('accountId')}
                    onChange={(value) => setValue('accountId', value)}
                    error={errors.accountId?.message}
                    disabled={isLoadingAccounts}
                    options={accounts?.map((account) => ({
                      value: account.id,
                      label: account.name,
                    })) || []}
                    placeholder="Select Account"
                    onCreateNew={() => setIsCreateAccountOpen(true)}
                    createButtonText="Create New Account"
                  />

                  <SelectInputWithCreate
                    label="Header"
                    value={watch('headerId')}
                    onChange={(value) => setValue('headerId', value)}
                    error={errors.headerId?.message}
                    disabled={isLoadingHeaders}
                    options={headers?.map((header) => ({
                      value: header.id,
                      label: header.name,
                    })) || []}
                    placeholder="Select Header"
                    onCreateNew={() => setIsCreateHeaderOpen(true)}
                    createButtonText="Create New Header"
                  />

                  <SelectInputWithCreate
                    label="Tag"
                    value={watch('tagId')}
                    onChange={(value) => setValue('tagId', value)}
                    error={errors.tagId?.message}
                    disabled={isLoadingTags}
                    options={tags?.map((tag) => ({
                      value: tag.id,
                      label: tag.name,
                    })) || []}
                    placeholder="Select Tag"
                    onCreateNew={() => setIsCreateTagOpen(true)}
                    createButtonText="Create New Tag"
                  />

                  <SelectInputWithCreate
                    label="Source/Destination"
                    value={watch('entityId')}
                    onChange={(value) => setValue('entityId', value)}
                    error={errors.entityId?.message}
                    disabled={isLoadingSourceDestinations}
                    options={sourceDestinations?.map((entity) => ({
                      value: entity.id,
                      label: entity.name,
                    })) || []}
                    placeholder="Select Source/Destination"
                    onCreateNew={() => setIsCreateSourceDestinationOpen(true)}
                    createButtonText="Create New Source/Destination"
                  />
                </form>
              </div>
              <div className="mt-auto flex justify-end gap-3 border-t px-6 py-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="edit-budget-form"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Budget"}
                </Button>
              </div>
              <Dialog.Close className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none">
                <Cross2Icon className="h-5 w-5" />
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Nested Dialogs */}
      <CreateAccountDialog
        open={isCreateAccountOpen}
        onOpenChange={setIsCreateAccountOpen}
        onSubmit={(data) => handleCreateAccount(data, () => setIsCreateAccountOpen(false))}
      />

      <CreateHeaderDialog
        open={isCreateHeaderOpen}
        onOpenChange={setIsCreateHeaderOpen}
        onSubmit={(data) => handleCreateHeader(data, () => setIsCreateHeaderOpen(false))}
      />

      <CreateTagDialog
        open={isCreateTagOpen}
        onOpenChange={setIsCreateTagOpen}
        onSubmit={(data) => handleCreateTag(data, () => setIsCreateTagOpen(false))}
      />

      <CreateSourceDestinationDialog
        open={isCreateSourceDestinationOpen}
        onOpenChange={setIsCreateSourceDestinationOpen}
        onSubmit={(data) => handleCreateSourceDestination(data, () => setIsCreateSourceDestinationOpen(false))}
      />
    </>
  );
} 