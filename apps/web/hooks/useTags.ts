import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateTagInput, Tag } from "@cashbook/utils";
import { api } from '@/lib/api-client';

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
    },
  });

  const updateTag = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateTagInput> }) => {
      const response = await api.put(`/api/tags/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
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
