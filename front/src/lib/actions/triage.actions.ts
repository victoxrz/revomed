"use server";
import { FormState } from "@/lib/definitions";
import {
  Triage,
  TriageErrors,
  TriageSchema,
} from "../../app/(withDrawer)/patients/_components/triages/types";
import { revalidateTag } from "next/cache";
import z from "zod/v4";
import { fetchClient } from "@/lib/actions";

export async function create(
  _state: FormState<TriageErrors, Triage>,
  formData: FormData
): Promise<FormState<TriageErrors, Triage>> {
  const data: Triage = Object.fromEntries(
    formData.entries()
  ) as unknown as Triage;

  const validatedFields = TriageSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error),
      inputs: data,
    };
  }

  const response = await fetchClient.post(
    `/triages/create?patientId=${validatedFields.data.patientId}`,
    validatedFields.data,
    {
      withAuth: true,
    }
  );

  if (response.message)
    return {
      inputs: validatedFields.data,
      message: response.message,
    };

  revalidateTag(`/triages/get?patientId=${validatedFields.data.patientId}`);
  return {
    inputs: null,
    message: "Triage created successfully.",
    isSuccessful: true,
  };
}

export async function getByPatientId(patientId: number) {
  const response = await fetchClient.get<Triage & { updatedAt: string }>(
    `/triages/get?patientId=${patientId}`,
    {
      withAuth: true,
      // cache: "force-cache",
      next: {
        revalidate: 60 * 60,
        tags: [`/triages/get?patientId=${patientId}`],
      },
    }
  );

  return response.data;
}
