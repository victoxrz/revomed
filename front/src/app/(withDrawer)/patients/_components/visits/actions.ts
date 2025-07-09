"use server";
import { FormState } from "@/lib/definitions";
import { fetchGet, fetchPost } from "@/lib/fetchWrap";
import z from "zod/v4";
import { Visit, visitErrors, VisitSchema, VisitTemplate } from "./types";
import { redirect } from "next/navigation";
import { decodeToken } from "@/lib/dal";
import { VisitItem } from "./VisitList";

export async function createVisit(
  _state: FormState<visitErrors, Visit>,
  formData: FormData
): Promise<FormState<visitErrors, Visit>> {
  const data: Visit = {
    fields: formData.getAll("fields") as string[],
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

  const response = await fetchPost("/visits/create", validatedFields.data, {
    withAuth: true,
  });

  if (response.message) {
    return {
      inputs: data,
      message: response.message,
    };
  }

  // TODO: sometimes its better to show succesful message
  redirect(`/patients/${validatedFields.data.patientId}`);
}

export async function visitTemplateGet() {
  const payload = await decodeToken();
  if (!payload) return;

  const response = await fetchGet<VisitTemplate>(
    `/templates/get/${payload.templateId}`,
    {
      withAuth: true,
    }
  );

  if (response.data) {
    return response.data;
  } else {
    console.error("Error fetching: ", response.message);
  }
}

export async function VisitGet(patientId: number) {
  const response = await fetchGet<VisitItem[]>(
    `/visits/get?patientId=${patientId}`,
    {
      withAuth: true,
    }
  );

  if (response.message) console.error("Error fetching: ", response.message);

  return response.data;
}
