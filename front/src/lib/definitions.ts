import { z } from "zod/v4";

export type FormState<TErrors, TInputs> =
  | {
      errors?: TErrors;
      inputs: TInputs;
      message?: string;
    }
  | undefined;

export const VisitSchema = z.object({
  patientId: z.coerce
    .number()
    .positive("Patient ID must be a positive integer"),
  templateId: z.coerce
    .number()
    .positive("Template ID must be a positive integer"),
  fields: z.array(z.string().nonempty("Fields must not be empty")),
});
export type Visit = z.infer<typeof VisitSchema>;
export type visitErrors = z.ZodFlattenedError<Visit>;

export const VisitTemplateSchema = z.object({
  titles: z.array(z.string().nonempty("Title must not be empty")),
});
export type VisitTemplate = z.infer<typeof VisitTemplateSchema>;
export type VisitTemplateErrors = z.ZodFlattenedError<VisitTemplate>;
