"use client";

import { useState } from "react";
import { TagCard } from "@/components/tags/TagCard";
import { Button } from "@/components/ui/Button";
import { useTags } from "@/hooks/useTags";
import type { CreateTagInput, Tag } from "@cashbook/utils";
import { Loader2 } from "lucide-react";
import { CreateTagDialog } from "@/components/tags/CreateTagDialog";
import { EditTagDialog } from "@/components/tags/EditTagDialog";

export default function TagsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editTag, setEditTag] = useState<Tag | null>(null);

  const {
    tags,
    isLoading,
    error,
    createTag,
    updateTag,
  } = useTags();

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
        <h1 className="text-2xl font-semibold">Tags</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Create New Tag
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tags?.map((tag) => (
          <TagCard
            key={tag.id}
            tag={tag}
            onEdit={() => 
              setEditTag(tag)
            }
          />
        ))}
      </div>

      <CreateTagDialog 
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={(data: CreateTagInput) => {
          createTag.mutate({ data }, {
            onSuccess: () => setIsCreateModalOpen(false),
          });
        }}
      />

      <EditTagDialog 
        open={!!editTag}
        onOpenChange={(open) => !open && setEditTag(null)}
        tag={editTag}
        onSubmit={( data ) => {
          if (!editTag) return;
          updateTag.mutate({ id: editTag.id, data },
            {
              onSuccess: () => setEditTag(null),
            }
          )
        }}
      />
    </div>
  );
}
