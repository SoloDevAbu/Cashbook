'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { type UpdateAccountInput } from '@cashbook/validation';
import { updateAccountSchema } from '@cashbook/validation';
import { Account } from '@cashbook/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';

interface EditAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account;
  onSubmit: (data: UpdateAccountInput) => void;
}

export function EditAccountDialog({ 
  open, 
  onOpenChange, 
  account, 
  onSubmit 
}: EditAccountDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateAccountInput>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      type: account.type,
      name: account.name,
      accountNumber: account.accountNumber,
      details: account.details,
      upiLinks: account.upiLinks,
    },
  });

  const handleFormSubmit = async (data: UpdateAccountInput) => {
    try {
      await onSubmit(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[55%] max-h-[85vh] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <Dialog.Title className="text-2xl font-bold">Edit Account</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-600">
            Update your account information below
          </Dialog.Description>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-6 space-y-4">
            <Input
              label="Account Name"
              type="text"
              {...register('name')}
              error={errors.name?.message}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Account Type</label>
              <select
                {...register('type')}
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                  errors.type ? 'ring-red-500' : 'ring-gray-300'
                } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-transparent sm:text-sm sm:leading-6`}
              >
                <option value="">Select account type</option>
                <option value="CASH">Cash</option>
                <option value="BANK_SB">Bank Savings</option>
                <option value="BANK_CREDIT">Bank Credit</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="DEMAT">Demat</option>
                <option value="LOAN">Loan</option>
                <option value="TRADING">Trading</option>
                <option value="UPI">UPI</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <Input
              label="Account Number"
              type="text"
              {...register('accountNumber')}
              error={errors.accountNumber?.message}
            />

            <Input
              label="Details"
              type="text"
              {...register('details')}
              error={errors.details?.message}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">UPI Links</label>
              <input
                type="text"
                placeholder="UPI links (one per line)"
                className={`block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                  errors.upiLinks ? 'ring-red-500' : 'ring-gray-300'
                } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-transparent sm:text-sm sm:leading-6`}
                {...register('upiLinks')}
              />
              {errors.upiLinks && (
                <p className="text-sm text-red-500">{errors.upiLinks.message}</p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>

          <Dialog.Close className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none">
            <Cross2Icon className="h-5 w-5" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
