"use server";
import { FormState } from "@/lib/definitions";
import { fetchPost } from "@/lib/fetchWrap";
import z from "zod/v4";
import { Visit, visitErrors, VisitSchema } from "./types";
import { redirect } from "next/navigation";

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

  console.log("Response:", response.message);

  if (response.message) {
    return {
      inputs: data,
      message: response.message,
    };
  }

  // TODO: sometimes its better to show succesful message
  redirect(`/patients/${validatedFields.data.patientId}`);
}
