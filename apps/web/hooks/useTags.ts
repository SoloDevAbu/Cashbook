import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateTagInput, Tag } from "@cashbook/utils";
import { api } from '@/lib/api-client';
import { toast } from "sonner";

export function useTags() {
  const queryClient = useQueryClient();

  const { data: tags, isLoading, error } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await api.get("/api/tags");
      return response.data;
    },
  });

  const createTag = useMutation({
    mutationFn: async ({ data }: { data: CreateTagInput }) => {
      const response = await api.post("/api/tags", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag created successfully");
    },
    onError: () => {
      toast.error("Failed to create Tag");
    },
  });

  const updateTag = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateTagInput> }) => {
      const response = await api.put(`/api/tags/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag updated successfully");
    },
    onError: () => {
      toast.error("Failed to update Tag");
    },
  });

  return {
    tags,
    isLoading,
    error,
    createTag,
    updateTag,
  };
}
