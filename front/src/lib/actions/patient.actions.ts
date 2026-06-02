"use server";
import { FormState, GENERIC_ERROR_MESSAGE } from "@/lib/definitions";
import {
  patientErrors,
  PatientSchema,
  PatientModel,
  Patient,
} from "../../app/(withDrawer)/patients/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod/v4";
import axiosInstance from "@/lib/axiosConfig";
import { APIError } from "@/lib/errors";

// https://sqids.org/
export async function create(
  _state: FormState<patientErrors, Patient>,
  formData: FormData,
): Promise<FormState<patientErrors, Patient>> {
  const data: Patient = Object.fromEntries(
    formData.entries(),
  ) as unknown as Patient;

  const validatedFields = PatientSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error),
      inputs: data,
    };
  }

  try {
    await axiosInstance.post("/patients/create", validatedFields.data);
  } catch (error) {
    return {
      inputs: validatedFields.data,
      message:
        error instanceof APIError ? error.message : GENERIC_ERROR_MESSAGE,
    };
  }

  redirect("/patients");
}

export async function update(
  _state: FormState<patientErrors, Patient>,
  formData: FormData,
): Promise<FormState<patientErrors, Patient>> {
  const data: Patient = Object.fromEntries(
    formData.entries(),
  ) as unknown as Patient;

  const validatedFields = PatientSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error),
      inputs: data,
    };
  }

  try {
    await axiosInstance.put(`/patients/update/${formData.get("id")}`, data);
  } catch (error) {
    return {
      inputs: validatedFields.data,
      message:
        error instanceof APIError ? error.message : GENERIC_ERROR_MESSAGE,
    };
  }

  revalidatePath("/patients");
  redirect("/patients");
}

// should respond with the message
export async function remove(
  _state: { message: string } | undefined,
  formData: FormData,
): Promise<{ message: string }> {
  try {
    await axiosInstance.delete(`/patients/delete/${formData.get("id")}`);
  } catch (error) {
    return {
      message:
        error instanceof APIError ? error.message : GENERIC_ERROR_MESSAGE,
    };
  }

  revalidatePath("/patients");
  redirect("/patients");
}

export async function getAll(page: number, pageSize: number) {
  const response = await axiosInstance.get<{
    patients: PatientModel[];
    totalCount: number;
  }>(
    "/patients/list?" +
      new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      }),
  );

  return response.data ?? { patients: [], totalCount: 0 };
}

export async function getById(id: number) {
  const response = await axiosInstance.get<Patient>(`/patients/get/${id}`, {
    fetchOptions: { next: { revalidate: 3600 }, cache: "force-cache" },
  });

  return response.data;
}
