import z from "zod/v4";

export interface PatientModel {
  id: number;
  lastName: string;
  firstName: string;
  birthday: Date;
  gender: string;
  phone: string;
}

export const PatientSchema = z
  .object({
    id: z.coerce.number(),
    lastName: z.string().trim().nonempty("Last name must not be empty").max(30),
    firstName: z
      .string()
      .trim()
      .nonempty("First name must not be empty")
      .max(30),
    patronymic: z.string().trim().max(30),
    birthday: z.iso.date("Birthday must not be empty"),
    gender: z.enum(["Male", "Female", "Other"], {
      error: "Gender is required",
    }),
    bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
      error: "Blood type is required",
    }),
    idnp: z
      .string()
      .trim()
      .nonempty("IDNP must not be empty")
      .length(13, "IDNP must be 13 characters long"),
    job: z.string().trim().nonempty("Job must not be empty").max(30),
    streetAddress: z
      .string()
      .trim()
      .nonempty("Street address must not be empty")
      .max(30),
    country: z.string().trim().nonempty("Country must not be empty").max(30),
    phone: z
      .string()
      .trim()
      .regex(/^[\-\+\d]+$/, "Invalid phone number")
      .nonempty("Phone must not be empty")
      .max(15),
  })
  .refine((data) => new Date(data.birthday).getFullYear() >= 1900, {
    message: "Birthday must be in or after 1900",
    path: ["birthday"],
  });
export type Patient = z.infer<typeof PatientSchema>;
export type patientErrors = z.ZodFlattenedError<Patient>;
