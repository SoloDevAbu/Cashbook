import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateSourceDestinationInput,
  UpdateSourceDestinationInput,
} from "@cashbook/utils";
import { sourceDestinationsApi } from "@/services/source-destination";
import { toast } from "sonner";

export function useSourceDestinations() {
  const queryClient = useQueryClient();
    const {
    data: sourceDestinations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sourceDestinations"],
    queryFn: sourceDestinationsApi.getAll
  });

  const createSourceDestination = useMutation({
    mutationFn: ({ data }: { data: CreateSourceDestinationInput }) => sourceDestinationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sourceDestinations"] });
      toast.success("Entity created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create entity");
    },
  });

  const updateSourceDestination = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSourceDestinationInput }) => sourceDestinationsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sourceDestinations"] });
      toast.success("Entity updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update entity");
    },
  });

  return {
    sourceDestinations,
    isLoading,
    error,
    createSourceDestination,
    updateSourceDestination,
  }
}