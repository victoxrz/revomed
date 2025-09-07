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
    insurancePolicy: z
      .string()
      .trim()
      .nonempty("Insurance policy must not be empty")
      .max(15),
  })
  .refine((data) => new Date(data.birthday).getFullYear() >= 1900, {
    error: "Birthday must be in or after 1900",
    path: ["birthday"],
  });
export type Patient = z.infer<typeof PatientSchema> & {
  isInsured?: boolean | null;
};
export type patientErrors = z.ZodFlattenedError<Patient>;

/**
 * 
 * 
 * import z from "zod";

export const PatientBase = z.object({
  id: z.coerce.number(),
  lastName: z.string().trim().nonempty("Last name must not be empty").max(30),
  firstName: z.string().trim().nonempty("First name must not be empty").max(30),
  patronymic: z.string().trim().max(30).optional(),
  birthday: z.string().nonempty("Birthday must not be empty"),
  gender: z.enum(["Male", "Female", "Other"]),
  bloodType: z.enum(["A+","A-","B+","B-","AB+","AB-","O+","O-"]),
  idnp: z.string().trim().nonempty("IDNP must not be empty").length(13),
  job: z.string().trim().nonempty("Job must not be empty").max(30),
  streetAddress: z.string().trim().nonempty("Street address must not be empty").max(30),
  country: z.string().trim().nonempty("Country must not be empty").max(30),
  phone: z.string().trim().regex(/^[\-\+\d]+$/, "Invalid phone number").nonempty().max(15),
  insurancePolicy: z.string().trim().nonempty("Insurance policy must not be empty").max(15),
}).refine(d => new Date(d.birthday).getFullYear() >= 1900, {
  message: "Birthday must be in or after 1900",
  path: ["birthday"],
});

export const PatientCreateSchema = PatientBase.omit({ id: true });
export const PatientUpdateSchema = PatientCreateSchema.partial();
export const PatientViewSchema = PatientBase.pick({
  id: true, lastName: true, firstName: true, birthday: true
});

export type Patient = z.infer<typeof PatientBase>;
export type PatientCreate = z.infer<typeof PatientCreateSchema>;
export type PatientUpdate = z.infer<typeof PatientUpdateSchema>;

// UI-only fields: TypeScript-only For UI-only fields, prefer TS-only intersections over runtime validation.
export type PatientWithUI = Patient & { selected?: boolean; tempNote?: string };

// Errors typed against the schema that you actually use to validate
export type PatientCreateErrors = z.ZodFlattenedError<PatientCreate>;

 */
