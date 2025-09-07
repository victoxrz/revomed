"use server";
import { FormState } from "@/lib/definitions";
import z from "zod/v4";
import {
  Visit,
  VisitErrors,
  VisitSchema,
} from "../../app/(withDrawer)/patients/_components/visits/types";
import { VisitItem } from "../../app/(withDrawer)/patients/_components/visits/VisitList";
import { revalidateTag } from "next/cache";
import { fetchClient } from "@/lib/actions";

export async function create(
  _state: FormState<VisitErrors, Visit>,
  formData: FormData
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

  const response = await fetchClient.post(
    "/visits/create",
    validatedFields.data,
    {
      withAuth: true,
    }
  );

  if (response.message) {
    return {
      inputs: data,
      message: response.message,
    };
  }

  revalidateTag(`/visits/get?patientId=${validatedFields.data.patientId}`);
  return {
    inputs: null,
    message: "Visit created successfully.",
    isSuccesful: true,
  };
}

export async function getByPatientId(patientId: number) {
  const response = await fetchClient.get<VisitItem[]>(
    `/visits/get?patientId=${patientId}`,
    {
      withAuth: true,
      next: {
        tags: [`/visits/get?patientId=${patientId}`],
      },
      // cache: "force-cache",
    }
  );

  return response.data;
}

export async function getSuggestion(
  query: string,
  templateId: number,
  titlePath: string
  // TODO: find alternatives and usecases
  // signal: AbortSignal
) {
  const response = await fetchClient.get<string[]>(
    `/suggestions/${templateId}/${titlePath}/search?q=${query}`,
    {
      withAuth: true,
      next: {
        tags: [`/suggestions/${templateId}/${titlePath}/search?q=${query}`],
      },
      cache: "force-cache",
      // signal: signal,
    }
  );

  return response.data;
}
