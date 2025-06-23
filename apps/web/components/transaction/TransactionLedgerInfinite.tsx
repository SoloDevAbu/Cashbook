"use client";

import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { TransactionLedger } from "./TransactionLedger";
import { Transaction } from "@cashbook/utils";
import { UseInfiniteQueryResult, InfiniteData } from "@tanstack/react-query";

interface TransactionLedgerInfiniteProps {
  query: UseInfiniteQueryResult<InfiniteData<{ items: Transaction[]; nextCursor: string | null }>, unknown>;
  onEdit: (t: Transaction) => void;
  onStatusChange: (t: Transaction, status: Transaction["status"]) => void;
}

export function TransactionLedgerInfinite({
  query,
  onEdit,
  onStatusChange,
}: TransactionLedgerInfiniteProps) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [inView, query]);

  const transactions = query.data
    ? query.data.pages.flatMap((p) => p.items)
    : [];

  return (
    <div className="max-h-[500px] overflow-auto">
      <TransactionLedger
        transactions={transactions}
        hasMore={Boolean(query.hasNextPage)}
        onLoadMore={() => query.fetchNextPage()}
        onEdit={onEdit}
        onStatusChange={onStatusChange}
      />
      {query.isFetchingNextPage && (
        <div className="flex justify-center py-2">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      )}
      <div ref={ref} />
    </div>
  );
} 