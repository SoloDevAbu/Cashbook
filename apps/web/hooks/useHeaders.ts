import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Header, CreateHeaderInput, UpdateHeaderStatusInput } from "@cashbook/utils";
import { api } from '@/lib/api-client';

export function useHeaders() {
  const queryClient = useQueryClient();

  const { data: headers, isLoading, error } = useQuery<Header[]>({
    queryKey: ["headers"],
    queryFn: async () => {
      const response = await api.get("/api/headers");
      return response.data;
    },
  });

  const createHeader = useMutation({
    mutationFn: async ({ data }: { data: CreateHeaderInput }) => {
      const response = await api.post("/api/headers", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["headers"] });
    },
  });

  // const updateHeader = useMutation({
  //   mutationFn: async ({ id, data }: { id: string; data: Partial<CreateHeaderInput> }) => {
  //     const response = await api.patch(`/api/headers/${id}`, data);
  //     return response.data;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["headers"] });
  //   },
  // });

  const updateHeaderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: UpdateHeaderStatusInput["status"] }) => {
      const response = await api.patch(`/api/headers/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["headers"] });
    },
  });

  return {
    headers,
    isLoading,
    error,
    createHeader,
    // updateHeader,
    updateHeaderStatus,
  };
}
