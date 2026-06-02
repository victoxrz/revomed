"use server";
import axiosInstance from "@/lib/axiosConfig";
import {
  AppointmentErrors,
  AppointmentModel,
  AppointmentSchema,
  type Appointment,
} from "./types";
import { FormState, GENERIC_ERROR_MESSAGE } from "@/lib/definitions";
import { APIError } from "@/lib/errors";
import z from "zod/v4";

export async function getMyAppointments() {
  const response = await axiosInstance.get<Appointment[]>("/appointments/me");
  return response.data;
}

export async function getAllAppointments() {
  // const response = await axiosInstance.get<Appointment[]>('/appointments/list');
  const response: { data: AppointmentModel[] } = {
    data: [
      {
        id: "1",
        patientId: "p1",
        patientName: "John Doe",
        medicId: "m1",
        medicName: "Dr. Smith",
        startTime: new Date().toISOString(),
        endTime: new Date(new Date().getTime() + 30 * 60000).toISOString(),
        status: "Pending",
        reason: "General Checkup",
      },
    ],
  }; // Placeholder until backend is ready
  return response.data;
}

export async function getAppointmentById(id: string) {
  const response = await axiosInstance.get<Appointment>(
    `/appointments/get/${id}`,
  );
  return response.data;
}

export async function create(
  _state: FormState<AppointmentErrors, Appointment>,
  formData: FormData,
): Promise<FormState<AppointmentErrors, Appointment>> {
  const data: Appointment = Object.fromEntries(
    formData.entries(),
  ) as unknown as Appointment;

  const validatedFields = AppointmentSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error),
      inputs: data,
    };
  }

  try {
    const response = await axiosInstance.post<Appointment>(
      "/appointments/create",
      data,
    );
  } catch (error) {
    return {
      inputs: validatedFields.data,
      message:
        error instanceof APIError ? error.message : GENERIC_ERROR_MESSAGE,
    };
  }

  return {
    inputs: null,
    message: "Appointment created successfully",
    isSuccessful: true,
  };
}

export async function update(
  _state: FormState<AppointmentErrors, Appointment>,
  formData: FormData,
): Promise<FormState<AppointmentErrors, Appointment>> {
  const data: Appointment = Object.fromEntries(
    formData.entries(),
  ) as unknown as Appointment;

  const validatedFields = AppointmentSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error),
      inputs: data,
    };
  }

  try {
    const response = await axiosInstance.put<Appointment>(
      `/appointments/update/${validatedFields.data.id}`,
      data,
    );
  } catch (error) {
    return {
      inputs: validatedFields.data,
      message:
        error instanceof APIError ? error.message : GENERIC_ERROR_MESSAGE,
    };
  }
  return {
    inputs: null,
    message: "Appointment updated successfully",
    isSuccessful: true,
  };
}

export async function updateAppointmentStatus(
  _state: { success: boolean; error?: string } | null,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const id = formData.get("appointmentId") as string;
    const status = formData.get("status") as string;

    await axiosInstance.put(`/appointments/update/${id}`, { status });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof APIError ? error.message : GENERIC_ERROR_MESSAGE,
    };
  }
}

export async function getAvailableSlots(
  medicId: string,
  date: string,
): Promise<{ start: string; end: string }[]> {
  const response = await axiosInstance.get<{ start: string; end: string }[]>(
    "/appointments/available",
    {
      params: { medicId, date },
    },
  );
  return response.data;
}
