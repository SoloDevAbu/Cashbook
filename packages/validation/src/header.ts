import { z } from "zod";

export const createHeaderSchema = z.object({
  name: z.string().min(1, "Header name is required"),
  details: z.string().optional(),
  status: z.enum(["ACTIVE", "NOT_ACTIVE"], {
    errorMap: () => ({ message: "Invalid header status" })
  }).default("ACTIVE")
});

export const updateHeaderStatusSchema = z.object({
  status: z.enum(["ACTIVE", "NOT_ACTIVE"], {
    errorMap: () => ({ message: "Invalid header status" })
  })
});

export type CreateHeaderInput = z.infer<typeof createHeaderSchema>;
export type UpdateHeaderStatusInput = z.infer<typeof updateHeaderStatusSchema>;
