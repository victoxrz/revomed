import z from "zod/v4";

export const LoginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password field must not be empty"),
  // .regex(/[a-zA-Z]/, "contain at least one letter"),
});
export type Login = z.infer<typeof LoginSchema>;
export type loginErrors = z.ZodFlattenedError<Login>;

export const SignupSchema = z
  .object({
    email: z.email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "be at least 6 characters long")
      .regex(/[a-zA-Z]/, "contain at least one letter"),
    confirmPassword: z
      .string()
      .min(1, "Confirm password field must not be empty"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords did not match",
    path: ["confirmPassword"],
  });
export type Signup = z.infer<typeof SignupSchema>;
export type signupErrors = z.ZodFlattenedError<Signup>;
