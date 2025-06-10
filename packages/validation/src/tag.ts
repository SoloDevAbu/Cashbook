import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
  details: z.string().optional()
});

export const updateTagSchema = createTagSchema.partial();

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
