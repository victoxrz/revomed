import z from "zod/v4";

export const VisitTemplateSchema = z.object({
  id: z.coerce.number(),
  name: z.string().nonempty("Name is required"),
  titles: z.array(z.array(z.string().nonempty("Title is required"))),
  requireTriage: z.coerce.boolean().default(false),
});
export type VisitTemplate = z.infer<typeof VisitTemplateSchema>;
export type VisitTemplateErrors = z.ZodFlattenedError<VisitTemplate>;
