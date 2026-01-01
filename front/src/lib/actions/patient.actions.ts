"use server";
import { FormState } from "@/lib/definitions";
import {
  patientErrors,
  PatientSchema,
  PatientModel,
  Patient,
} from "../../app/(withDrawer)/patients/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod/v4";
import { fetchClient } from "@/lib/actions";

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

  const response = await fetchClient.post(
    "/patients/create",
    validatedFields.data,
    {
      withAuth: true,
    },
  );

  if (response.message)
    return {
      inputs: validatedFields.data,
      message: response.message,
    };

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

  const response = await fetchClient.put(
    `/patients/update/${formData.get("id")}`,
    data,
    {
      withAuth: true,
    },
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
export async function remove(
  _state: { message: string } | undefined,
  formData: FormData,
): Promise<{ message: string }> {
  const response = await fetchClient.remove(
    `/patients/delete/${formData.get("id")}`,
    {
      withAuth: true,
    },
  );

  if (response.message)
    return {
      message: response.message,
    };
  revalidatePath("/patients");
  redirect("/patients");
}

export async function getAll(page: number, pageSize: number) {
  const response = await fetchClient.get<{
    patients: PatientModel[];
    totalCount: number;
  }>(
    "/patients/list?" +
      new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      }),
    {
      withAuth: true,
    },
  );

  return response.data ?? { patients: [], totalCount: 0 };
}

export async function getById(id: number) {
  const response = await fetchClient.get<Patient>(`/patients/get/${id}`, {
    withAuth: true,
    cache: "force-cache",
    next: { revalidate: 3600 },
  });

  return response.data;
}
