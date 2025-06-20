import React from 'react';
import type { Budget } from '@cashbook/utils';
import { format } from 'date-fns';
import { useAccounts } from '@/hooks/useAccounts';
import { useHeaders } from '@/hooks/useHeaders';
import { useTags } from '@/hooks/useTags';
import { useSourceDestinations } from '@/hooks/useSourceDestinatio';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/DropDownMenu';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loader2 } from 'lucide-react';

interface BudgetLedgerProps {
  items: Budget[];
  hasMore: boolean;
  onLoadMore: () => void;
  onEdit: (budget: Budget) => void;
  onStatusChange: (budget: Budget, status: Budget['status']) => void;
}

const statusConfig = {
  UNDER_PROCESS: { label: 'Under Process', color: 'bg-yellow-100 text-yellow-800' },
  COMPLETE_EXACT: { label: 'Complete', color: 'bg-green-100 text-green-800' },
  COMPLETE_UNDERPAID: { label: 'Complete (Under paid)', color: 'bg-blue-100 text-blue-800' },
  COMPLETE_OVERPAID: { label: 'Complete (Over paid)', color: 'bg-purple-100 text-purple-800' },
  PARTIALLY_PAID: { label: 'Partially Paid', color: 'bg-orange-100 text-orange-800' },
  STALLED: { label: 'Stalled', color: 'bg-red-100 text-red-800' },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
};

const statusOptions = Object.entries(statusConfig).map(([value, { label }]) => ({
  value: value as Budget['status'],
  label,
}));

export function BudgetLedger({ items, hasMore, onLoadMore, onEdit, onStatusChange }: BudgetLedgerProps) {
  const { accounts } = useAccounts();
  const { headers } = useHeaders();
  const { tags } = useTags();
  const { sourceDestinations } = useSourceDestinations();

  return (
    <div id="budget-ledger-scroll" style={{ maxHeight: 500, overflow: 'auto' }}>
      <InfiniteScroll
        dataLength={items.length}
        next={onLoadMore}
        hasMore={hasMore}
        loader={<div className="flex justify-center py-2"><Loader2 className="h-5 w-5 animate-spin" /></div>}
        scrollableTarget="budget-ledger-scroll"
      >
        <table className="min-w-full border border-gray-300 bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-xs text-gray-700">
              <th className="px-3 py-2 border-b">Type</th>
              <th className="px-3 py-2 border-b">Amount</th>
              <th className="px-3 py-2 border-b">Details</th>
              <th className="px-3 py-2 border-b">PAN</th>
              <th className="px-3 py-2 border-b">Date</th>
              <th className="px-3 py-2 border-b">Account</th>
              <th className="px-3 py-2 border-b">Header</th>
              <th className="px-3 py-2 border-b">Tag</th>
              <th className="px-3 py-2 border-b">Source/Destination</th>
              <th className="px-3 py-2 border-b">Status</th>
              <th className="px-3 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((budget) => {
              const account = accounts?.find(a => a.id === budget.accountId);
              const header = headers?.find(h => h.id === budget.headerId);
              const tag = tags?.find(t => t.id === budget.tagId);
              const entity = sourceDestinations?.find(e => e.id === budget.entityId);
              return (
                <tr key={budget.id} className="border-b hover:bg-gray-50 text-sm">
                  <td className="px-3 py-2">{budget.type}</td>
                  <td className="px-3 py-2">{budget.amount}</td>
                  <td className="px-3 py-2">{budget.details}</td>
                  <td className="px-3 py-2">{budget.transferId}</td>
                  <td className="px-3 py-2">{format(new Date(budget.transactionDate), 'PPP')}</td>
                  <td className="px-3 py-2">{account?.name || 'N/A'}</td>
                  <td className="px-3 py-2">{header?.name || 'N/A'}</td>
                  <td className="px-3 py-2">{tag?.name || 'N/A'}</td>
                  <td className="px-3 py-2">{entity?.name || 'N/A'}</td>
                  <td className="px-3 py-2">
                    <DropdownMenu>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[budget.status].color}`}>
                          {statusConfig[budget.status].label}
                        </span>
                        <DropdownMenuTrigger asChild>
                          <button className="text-gray-400 hover:text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 14a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                            </svg>
                          </button>
                        </DropdownMenuTrigger>
                      </div>
                      <DropdownMenuContent align="end" className="shadow shadow-gray-500">
                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">Change Status</div>
                        {statusOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => onStatusChange(budget, option.value)}
                            className={`flex items-center gap-2 px-2 py-2 text-sm ${option.value === budget.status ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                            <span className={`px-2 py-1 rounded-full ${statusConfig[option.value].color}`}>{option.label}</span>
                            {option.value === budget.status && (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-auto">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                              </svg>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => onEdit(budget)} className="text-gray-400 hover:text-gray-500 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
} 