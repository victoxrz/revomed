import { z } from "zod/v4";

// export type FormState<TErrors, TInputs> = {
//   errors?: TErrors;
//   inputs: TInputs | null;
//   message?: string;
// };

export type FormState<TErrors, TInputs> =
  | {
      inputs: TInputs | null;
      errors: TErrors;
      message?: never;
    }
  | {
      inputs: TInputs | null;
      errors?: never;
      message: string;
    };

export const VisitTemplateSchema = z.object({
  id: z.coerce.number(),
  titles: z.array(z.string().nonempty("Title must not be empty")),
});
export type VisitTemplate = z.infer<typeof VisitTemplateSchema>;
export type VisitTemplateErrors = z.ZodFlattenedError<VisitTemplate>;
