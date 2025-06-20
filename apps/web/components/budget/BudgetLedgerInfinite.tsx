"use client";

import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { BudgetLedger } from "./BudgetLedger";
import { Budget } from "@cashbook/utils";
import { UseInfiniteQueryResult, InfiniteData } from "@tanstack/react-query";

interface BudgetLedgerInfiniteProps {
  query: UseInfiniteQueryResult<InfiniteData<{ items: Budget[]; nextCursor: string | null }>, unknown>;
  onEdit: (b: Budget) => void;
  onStatusChange: (b: Budget, status: Budget["status"]) => void;
}

export function BudgetLedgerInfinite({
  query,
  onEdit,
  onStatusChange,
}: BudgetLedgerInfiniteProps) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [inView, query]);

  const budgets = query.data
    ? (query.data as InfiniteData<{ items: Budget[] }> ).pages.flatMap((p) => p.items)
    : [];

  return (
    <div className="max-h-[500px] overflow-auto">
      <BudgetLedger
        items={budgets}
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
