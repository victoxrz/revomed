"use server";
import { FormState, GENERIC_ERROR_MESSAGE } from "@/lib/definitions";
import z from "zod/v4";
import {
  Visit,
  VisitErrors,
  VisitSchema,
} from "../../app/(withDrawer)/patients/_components/visits/types";
import { VisitItem } from "../../app/(withDrawer)/patients/_components/visits/VisitList";
import { revalidateTag } from "next/cache";
import axiosInstance from "@/lib/axiosConfig";
import { APIError } from "@/lib/errors";

export async function create(
  _state: FormState<VisitErrors, Visit>,
  formData: FormData,
): Promise<FormState<VisitErrors, Visit>> {
  let fieldsData: Record<string, string> = {};
  const prefix = "fields-";
  formData.forEach((v, k) => {
    const val = v.toString();
    if (k.startsWith(prefix) && val) fieldsData[k.slice(prefix.length)] = val;
  });

  const data: Visit = {
    fields: fieldsData,
    patientId: Number(formData.get("patientId")),
    templateId: Number(formData.get("templateId")),
  };
  const validatedFields = VisitSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      inputs: data,
      errors: z.flattenError(validatedFields.error),
    };
  }

  try {
    await axiosInstance.post("/visits/create", validatedFields.data);

    revalidateTag(`/visits/get?patientId=${validatedFields.data.patientId}`);
    return {
      inputs: null,
      message: "Visit created successfully.",
      isSuccessful: true,
    };
  } catch (error) {
    return {
      inputs: data,
      message:
        error instanceof APIError ? error.message : GENERIC_ERROR_MESSAGE,
    };
  }
}

export async function getByPatientId(patientId: number) {
  const response = await axiosInstance.get<VisitItem[]>(
    `/visits/get?patientId=${patientId}`,
    {
      fetchOptions: {
        next: {
          tags: [`/visits/get?patientId=${patientId}`],
        },
        cache: "force-cache",
      },
    },
  );

  return response.data;
}

export async function getSuggestion(
  query: string,
  templateId: number,
  titlePath: string,
  // TODO: find alternatives and usecases
  // signal: AbortSignal
) {
  const response = await axiosInstance.get<string[]>(
    `/suggestions/${templateId}/${titlePath}/search?q=${query}`,
    {
      fetchOptions: {
        next: {
          tags: [`/suggestions/${templateId}/${titlePath}/search?q=${query}`],
        },
        cache: "force-cache",
        // signal,
      },
    },
  );

  return response.data;
}
