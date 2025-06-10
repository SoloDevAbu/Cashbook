import { z } from "zod";

export const createSourceDestinationSchema = z.object({
  name: z.string().min(3, "Entity name is required"),
  gst: z.string(),
  pan: z.string(),
  address: z.string(),
  state: z.string(),
  pin: z.string(),
  country: z.string(),
  nationalId: z.string(),
  details: z.string().optional()
});

export const updateSourceDestinationSchema = createSourceDestinationSchema.partial();

export type CreateSourceDestinationInput = z.infer<typeof createSourceDestinationSchema>;
export type UpdateSourceDestinationInput = z.infer<typeof updateSourceDestinationSchema>;
