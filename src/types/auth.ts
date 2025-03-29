
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(6, "Phone number must be at least 6 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  accountType: z.enum(["customer", "vendor"]),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the Terms of Service"
  }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
