import { z } from "zod";

export type FormState<T> =
  | {
      errors?: T;
      // message?: string;
    }
  | undefined;

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password field must not be empty"),
  // .regex(/[a-zA-Z]/, "contain at least one letter"),
});
export type loginErrors = z.inferFlattenedErrors<typeof LoginSchema>;

export const SignupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "be at least 6 characters long")
      .regex(/[a-zA-Z]/, "contain at least one letter"),
    confirmPassword: z
      .string()
      .min(1, "Confirm password field must not be empty"),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export type signupErrors = z.inferFlattenedErrors<typeof SignupSchema>;

export const CreateSchema = z.object({
  last_name: z.string().min(1, "Nume field must not be empty"),
  first_name: z.string().min(1, "Prenume field must not be empty"),
  birthday: z.coerce.date().min(new Date(1900, 0, 1), "Invalid date"),
  gender: z.enum(["Male", "Female"]),
});

export type createErrors = z.inferFlattenedErrors<typeof CreateSchema>;
