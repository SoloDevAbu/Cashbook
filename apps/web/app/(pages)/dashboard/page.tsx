'use client'

import React from 'react';
import { useAccounts } from '@/hooks/useAccounts';
import { useBudget } from '@/hooks/useBudget';
import { useTransactions } from '@/hooks/useTransactions';
import type { Budget, Transaction } from '@cashbook/utils';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

function calculateAccountBalance(accountId: string, transactions: Transaction[]): number {
  return transactions.reduce((balance, transaction) => {
    if (transaction.accountId === accountId) {
      return balance + (transaction.type === 'CREDIT' ? transaction.amount : -transaction.amount);
    }
    return balance;
  }, 0);
}

export default function DashboardPage() {
  const { accounts } = useAccounts();
  const { budgets } = useBudget();
  const { transactions } = useTransactions();

  const totalBalance = accounts?.reduce((sum, account) => {
    const balance = calculateAccountBalance(account.id, transactions || []);
    return sum + balance;
  }, 0) || 0;

  const pendingTransactions = transactions?.filter(t => t.status === 'PENDING') || [];

  const budgetsSummary = {
    total: budgets?.length || 0,
    underProcess: budgets?.filter((b: Budget) => b.status === 'UNDER_PROCESS').length || 0,
    complete: budgets?.filter((b: Budget) => b.status === 'COMPLETE_EXACT').length || 0,
    partiallyPaid: budgets?.filter((b: Budget) => b.status === 'PARTIALLY_PAID').length || 0,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Balance Card */}
        <div className="bg-white rounded-2xl border border-gray-400 p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {formatCurrency(totalBalance)}
          </p>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              Across {accounts?.length || 0} accounts
            </span>
          </div>
        </div>

        {/* Pending Transactions Card */}
        <div className="bg-white rounded-2xl border border-gray-400 p-6">
          <h3 className="text-sm font-medium text-gray-500">Pending Transactions</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {pendingTransactions.length}
          </p>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              Require attention
            </span>
          </div>
        </div>

        {/* Budgets Overview Card */}
        <div className="bg-white rounded-2xl border border-gray-400 p-6">
          <h3 className="text-sm font-medium text-gray-500">Budgets Overview</h3>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Budgets</span>
              <span className="text-sm font-medium text-gray-900">{budgetsSummary.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Under Process</span>
              <span className="text-sm font-medium text-gray-900">{budgetsSummary.underProcess}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Complete</span>
              <span className="text-sm font-medium text-gray-900">{budgetsSummary.complete}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Partially Paid</span>
              <span className="text-sm font-medium text-gray-900">{budgetsSummary.partiallyPaid}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white rounded-2xl border border-gray-400 p-6">
          <h3 className="text-sm font-medium text-gray-500">Recent Activity</h3>
          <div className="mt-2 space-y-2">
            {transactions?.slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{transaction.type}</p>
                  <p className="text-xs text-gray-500">{transaction.details}</p>
                </div>
                <span className={`text-sm font-medium ${
                  transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'CREDIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Account Balances Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Balances</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts?.map((account) => {
            const balance = calculateAccountBalance(account.id, transactions || []);
            return (
              <div key={account.id} className="bg-white rounded-2xl border border-gray-400 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{account.name}</h3>
                    <p className="text-xs text-gray-500">{account.type}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    account.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    account.status === 'FROZEN' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {account.status}
                  </span>
                </div>
                <p className="mt-4 text-2xl font-semibold text-gray-900">
                  {formatCurrency(balance)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
