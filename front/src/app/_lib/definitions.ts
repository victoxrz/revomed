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

export const PatientSchema = z.object({
  id: z.coerce.number(),
  lastName: z.string().min(1, "Nume field must not be empty"),
  firstName: z.string().min(1, "Prenume field must not be empty"),
  patronymic: z.string(),
  gender: z.enum(["Male", "Female", "Other"]),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  birthday: z.coerce.date().min(new Date(1900, 0, 1), "Invalid date"),
  idnp: z.string().length(13, "IDNP must be 13 characters long"),
  job: z.string(),
  streetAddress: z.string(),
  country: z.string(),
  phone: z.string(),
});

export type patientErrors = z.inferFlattenedErrors<typeof PatientSchema>;
export type Patient = z.infer<typeof PatientSchema>;
