import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "be at least 6 characters long")
    .regex(/[a-zA-Z]/, "contain at least one letter"),
});
export type loginErrors = z.inferFlattenedErrors<typeof LoginSchema>;

export type LoginState =
  | {
      errors?: loginErrors;
      // message?: string;
    }
  | undefined;
