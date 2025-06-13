import { api } from "@/lib/api-client";
import type {
  CreateSourceDestinationInput,
  SourceDestination,
  UpdateSourceDestinationInput,
} from "@cashbook/utils";

export const sourceDestinationsApi = {
  getAll: async (): Promise<SourceDestination[]> => {
    const response = await api.get("/api/entities");
    return response.data;
  },
  create: async (
    input: CreateSourceDestinationInput
  ): Promise<SourceDestination> => {
    const response = await api.post("/api/entities", input);
    return response.data;
  },
  update: async (
    id: string,
    input: UpdateSourceDestinationInput
  ): Promise<SourceDestination> => {
    const response = await api.put(`/api/entities/${id}`, input);
    return response.data;
  },
};
