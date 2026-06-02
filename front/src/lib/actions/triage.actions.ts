"use server";
import { FormState, GENERIC_ERROR_MESSAGE } from "@/lib/definitions";
import {
  Triage,
  TriageErrors,
  TriageSchema,
} from "../../app/(withDrawer)/patients/_components/triages/types";
import { revalidateTag } from "next/cache";
import z from "zod/v4";
import axiosInstance from "@/lib/axiosConfig";
import { APIError } from "@/lib/errors";

export async function create(
  _state: FormState<TriageErrors, Triage>,
  formData: FormData,
): Promise<FormState<TriageErrors, Triage>> {
  const data: Triage = Object.fromEntries(
    formData.entries(),
  ) as unknown as Triage;

  const validatedFields = TriageSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error),
      inputs: data,
    };
  }

  try {
    await axiosInstance.post(
      `/triages/create?patientId=${validatedFields.data.patientId}`,
      validatedFields.data,
    );

    revalidateTag(`/triages/get?patientId=${validatedFields.data.patientId}`);
    return {
      inputs: null,
      message: "Triage created successfully.",
      isSuccessful: true,
    };
  } catch (error) {
    return {
      inputs: validatedFields.data,
      message:
        error instanceof APIError ? error.message : GENERIC_ERROR_MESSAGE,
    };
  }
}

export async function getByPatientId(patientId: number) {
  const response = await axiosInstance.get<Triage & { updatedAt: string }>(
    `/triages/get?patientId=${patientId}`,
    {
      fetchOptions: {
        cache: "force-cache",
        next: {
          revalidate: 60 * 60,
          tags: [`/triages/get?patientId=${patientId}`],
        },
      },
    },
  );

  return response.data;
}
