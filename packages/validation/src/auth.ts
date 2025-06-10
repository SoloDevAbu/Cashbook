import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(1),
  altPhone: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(6),
  companyName: z.string().min(1),
  address: z.string().min(1),
  state: z.string().min(1),
  pin: z.string().min(1),
  country: z.string().min(1),
  defaultCurrency: z.string().optional(),
  pan: z.string().min(1),
  gst: z.string().optional(),
  nationalId: z.string().min(1),
});

export type RegistrationInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginInput = z.infer<typeof loginSchema>;
