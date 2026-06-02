import { Event } from "react-big-calendar";
import z from "zod";

export type AppointmentStatus = Appointment["status"];
export const AppointmentSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  medicId: z.string(),
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime(),
  status: z.enum(["Pending", "Confirmed", "Cancelled", "Completed"]),
  reason: z.string(),
  notes: z.string().optional(),
});
export const AppointmentCreateSchema = AppointmentSchema.omit({
  id: true,
  patientName: true,
  medicName: true,
});
export type Appointment = z.infer<typeof AppointmentSchema>;
export type AppointmentErrors = z.ZodFlattenedError<Appointment>;
export type AppointmentModel = Appointment & {
  patientName: string;
  medicName: string;
};

export interface CalendarEvent extends Event {
  start: Date;
  end: Date;
  resource: Omit<AppointmentModel, "startTime" | "endTime">;
}
