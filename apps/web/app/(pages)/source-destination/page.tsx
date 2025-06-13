"use client";

import { CreateSourceDestinationDialog } from "@/components/source-destination/CreateSourceDestinationDialog";
import { EditSourceDestinationDialog } from "@/components/source-destination/EditSourceDestinationDialog";
import { SourceDestinationCard } from "@/components/source-destination/SourceDestinationCard";
import { Button } from "@/components/ui/Button";
import { useSourceDestinations } from "@/hooks/useSourceDestinatio";
import {
  SourceDestination,
  CreateSourceDestinationInput,
} from "@cashbook/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function SourceDestinationPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editSourceDestination, setEditSourceDestination] =
    useState<SourceDestination | null>(null);

  const {
    sourceDestinations,
    isLoading,
    error,
    createSourceDestination,
    updateSourceDestination,
  } = useSourceDestinations();

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
        Failed to load accounts
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Entities</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Create New Entity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sourceDestinations?.map((entity) => (
          <SourceDestinationCard
            key={entity.id}
            entity={entity}
            onEdit={() => setEditSourceDestination(entity)}
          />
        ))}
      </div>

      <CreateSourceDestinationDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={(data: CreateSourceDestinationInput) => {
          createSourceDestination.mutate(
            { data },
            {
              onSuccess: () => {
                setIsCreateModalOpen(false);
              },
            }
          );
        }}
      />

      {editSourceDestination && (
        <EditSourceDestinationDialog
          open={!!editSourceDestination}
          onOpenChange={() => setEditSourceDestination(null)}
          entity={editSourceDestination}
          onSubmit={(data) => {
            updateSourceDestination.mutate(
              { id: editSourceDestination.id, data },
              {
                onSuccess: () => {
                  setEditSourceDestination(null);
                },
              }
            );
          }}
        />
      )}
    </div>
  );
}
