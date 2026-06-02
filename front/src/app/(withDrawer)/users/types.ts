import z from "zod/v4";

export interface UserModel {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userRole: number;
}

export const UserSchema = z.object({
  id: z.coerce.number(),
  email: z.email().trim().nonempty("Email must not be empty").max(40),
  firstName: z.string().trim().nonempty("First name must not be empty").max(30),
  lastName: z.string().trim().nonempty("Last name must not be empty").max(30),
  userRole: z.enum(["Patient", "Medic", "Admin", "User", "Assistant"], {
    error: "Role is required",
  }),
});

export type User = z.infer<typeof UserSchema>;
export type UserErrors = z.ZodFlattenedError<User>;

export type UserRole = z.infer<typeof UserSchema.shape.userRole>;
