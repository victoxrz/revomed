import z from "zod/v4";

export const VisitSchema = z.object({
  patientId: z.coerce
    .number()
    .positive("Patient ID must be a positive integer"),
  templateId: z.coerce
    .number()
    .positive("Template ID must be a positive integer"),
  fields: z.record(z.string(), z.string().trim()).refine(
    (f) => {
      const keys = Object.keys(f);
      return keys.length > 0 && keys.every((k) => f[k].length > 0);
    },
    {
      path: ["fields"],
      error: "Field value cannot be empty",
    }
  ),
});
export type Visit = z.infer<typeof VisitSchema>;
export type VisitErrors = z.ZodFlattenedError<Visit>;
