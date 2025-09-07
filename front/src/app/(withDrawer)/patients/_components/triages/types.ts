import z from "zod/v4";

export const TriageSchema = z.object({
  id: z.coerce.number(),
  patientId: z.coerce.number(),
  temperature: z.coerce
    .number()
    .min(30, "Temperature must be at least 30°C")
    .max(45, "Temperature must not exceed 45°C"),
  systolicPressure: z.coerce
    .number()
    .int()
    .min(50, "Systolic pressure must be at least 50 mmHg")
    .max(300, "Systolic pressure must not exceed 300 mmHg"),
  diastolicPressure: z.coerce
    .number()
    .int()
    .min(30, "Diastolic pressure must be at least 30 mmHg")
    .max(300, "Diastolic pressure must not exceed 300 mmHg"),
  heartRate: z.coerce
    .number()
    .int()
    .min(30, "Heart rate must be at least 30 bpm")
    .max(200, "Heart rate must not exceed 200 bpm"),
  respiratoryRate: z.coerce
    .number()
    .int()
    .min(5, "Respiratory rate must be at least 5 breaths per minute")
    .max(60, "Respiratory rate must not exceed 60 breaths per minute"),
  weight: z.coerce.number().positive("Weight must be a positive number"),
  waistCircumference: z.coerce
    .number()
    .positive("Waist circumference must be a positive number"),
  height: z.coerce.number().positive("Height must be a positive number"),
});
export type Triage = z.infer<typeof TriageSchema> & { updatedAt?: string };
export type TriageErrors = z.ZodFlattenedError<Triage>;
