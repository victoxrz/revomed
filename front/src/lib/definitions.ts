import { z } from "zod/v4";

export type FormState<TErrors, TInputs> =
  | {
      errors?: TErrors;
      inputs: TInputs;
      message?: string;
    }
  | undefined;

export const VisitTemplateSchema = z.object({
  titles: z.array(z.string().nonempty("Title must not be empty")),
});
export type VisitTemplate = z.infer<typeof VisitTemplateSchema>;
export type VisitTemplateErrors = z.ZodFlattenedError<VisitTemplate>;
