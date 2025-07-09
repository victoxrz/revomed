"use server";
import { FormState } from "@/lib/definitions";
import { patientErrors, PatientSchema, PatientModel, Patient } from "./types";
import { fetchPost, fetchRemove, fetchGet, fetchPut } from "@/lib/fetchWrap";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod/v4";

// https://sqids.org/
export async function patientCreate(
  _state: FormState<patientErrors, Patient>,
  formData: FormData
): Promise<FormState<patientErrors, Patient>> {
  const data: Patient = Object.fromEntries(
    formData.entries()
  ) as unknown as Patient;

  const validatedFields = PatientSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error),
      inputs: data,
    };
  }

  const response = await fetchPost("/patients/create", validatedFields.data, {
    withAuth: true,
  });

  if (response.message)
    return {
      inputs: validatedFields.data,
      message: response.message,
    };

  redirect("/patients");
}

export async function patientUpdate(
  _state: FormState<patientErrors, Patient>,
  formData: FormData
): Promise<FormState<patientErrors, Patient>> {
  const data: Patient = Object.fromEntries(
    formData.entries()
  ) as unknown as Patient;

  const validatedFields = PatientSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error),
      inputs: data,
    };
  }

  const response = await fetchPut(
    `/patients/update/${formData.get("id")}`,
    data,
    { withAuth: true }
  );

  if (response.message)
    return {
      inputs: validatedFields.data,
      message: response.message,
    };

  revalidatePath("/patients");
  redirect("/patients");
}

// should respond with the message
export async function patientRemove(
  _state: { message: string } | undefined,
  formData: FormData
): Promise<{ message: string }> {
  const response = await fetchRemove(`/patients/delete/${formData.get("id")}`, {
    withAuth: true,
  });

  if (response.message)
    return {
      message: response.message,
    };
  revalidatePath("/patients");
  redirect("/patients");
}

export async function patientList(): Promise<PatientModel[]> {
  const response = await fetchGet<PatientModel[]>("/patients/list", {
    withAuth: true,
  });

  return response.data ?? [];
}

export async function patientGet(patientId: number): Promise<Patient | null> {
  const response = await fetchGet<Patient>(`/patients/get/${patientId}`, {
    withAuth: true,
  });

  if (response.message) console.error("Error fetching: ", response.message);

  return response.data;
}
