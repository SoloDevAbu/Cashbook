'use client'

import React, { useState } from 'react';
import type { Transaction } from '@cashbook/utils';
import { format } from 'date-fns';
import { useAccounts } from '@/hooks/useAccounts';
import { useHeaders } from '@/hooks/useHeaders';
import { useTags } from '@/hooks/useTags';
import { useSourceDestinations } from '@/hooks/useSourceDestinatio';
import { useTransactions } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/Button';
import { UploadReceiptsDialog } from './UploadReceiptsDialog';
import { toast } from 'sonner';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: () => void;
  onStatusChange: (status: Transaction['status']) => void;
}

export function TransactionCard({
  transaction,
  onEdit,
  onStatusChange,
}: TransactionCardProps) {
  const { accounts } = useAccounts();
  const { headers } = useHeaders();
  const { tags } = useTags();
  const { sourceDestinations } = useSourceDestinations();
  const { uploadReceipt } = useTransactions();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const account = accounts?.find(a => a.id === transaction.accountId);
  const header = headers?.find(h => h.id === transaction.headerId);
  const tag = tags?.find(t => t.id === transaction.tagId);
  const entity = sourceDestinations?.find(e => e.id === transaction.entityId);

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    COMPLETE: 'bg-green-100 text-green-800',
  };

  const handleUpload = async (files: File[]) => {
    try {
      await uploadReceipt.mutateAsync({
        id: transaction.id,
        receipts: files
      });
      toast.success('Receipts uploaded successfully');
    } catch (error) {
      console.error('Error uploading receipts:', error);
      toast.error('Failed to upload receipts');
    }
  };

  return (
    <div className="border border-gray-400 rounded-2xl p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {transaction.type} - {transaction.amount}
          </h3>
          <p className="text-sm text-gray-600">{transaction.details}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[transaction.status]}`}
          >
            {transaction.status.charAt(0) + transaction.status.slice(1).toLowerCase()}
          </span>
          <button onClick={onEdit} className="text-gray-400 hover:text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">PAN: </span>
          {transaction.transferId}
        </div>
        <div>
          <span className="font-medium">Date: </span>
          {format(new Date(transaction.transactionDate), 'PPP')}
        </div>
        <div>
          <span className="font-medium">Account: </span>
          {account?.name || 'N/A'}
        </div>
        <div>
          <span className="font-medium">Header: </span>
          {header?.name || 'N/A'}
        </div>
        <div>
          <span className="font-medium">Tag: </span>
          {tag?.name || 'N/A'}
        </div>
        <div>
          <span className="font-medium">Source/Destination: </span>
          {entity?.name || 'N/A'}
        </div>
        {transaction.budgetId && (
          <div>
            <span className="font-medium">Budget: </span>
            {transaction.budgetId}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 justify-center">
        <Button
          variant="default"
          onClick={() => setIsUploadDialogOpen(true)}
        >
          Upload Receipts
        </Button>
      </div>

      {transaction.receiptUrls && transaction.receiptUrls.length > 0 && (
        <div className="text-sm">
          <span className="font-medium">Receipts: </span>
          <div className="mt-1 space-y-1">
            {transaction.receiptUrls.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Receipt {index + 1}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500">
        Added on {format(new Date(transaction.createdAt), 'PPP')}
      </div>

      <UploadReceiptsDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
} 