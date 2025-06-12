"use client";

import { useState } from "react";
import { HeaderCard } from "@/components/headers/HeaderCard";
import { CreateHeaderDialog } from "@/components/headers/CreateHeaderDialog";
// import { EditHeaderDialog } from "@/components/headers/EditHeaderDialog";
import { Button } from "@/components/ui/Button";
import { useHeaders } from "@/hooks/useHeaders";
import type { CreateHeaderInput } from "@cashbook/utils";
import { Loader2 } from "lucide-react";

export default function HeadersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // const [editHeader, setEditHeader] = useState<Header | null>(null);

  const {
    headers,
    isLoading,
    error,
    createHeader,
    updateHeaderStatus,
  } = useHeaders();

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
        Failed to load headers
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Headers</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Create New Header
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {headers?.map((header) => (
          <HeaderCard
            key={header.id}
            header={header}
            onStatusChange={(status) =>
              updateHeaderStatus.mutate({ id: header.id, status })
            }
          />
        ))}
      </div>

      <CreateHeaderDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={(data: CreateHeaderInput) => {
          createHeader.mutate({ data }, {
            onSuccess: () => setIsCreateModalOpen(false),
          });
        }}
      />

      {/* {editHeader && (
        <EditHeaderDialog
          open={!!editHeader}
          onOpenChange={(open) => !open && setEditHeader(null)}
          header={editHeader}
          onSubmit={(data) => {
            updateHeader.mutate(
              { id: editHeader.id, data },
              { onSuccess: () => setEditHeader(null) }
            );
          }}
        />
      )} */}
    </div>
  );
}
