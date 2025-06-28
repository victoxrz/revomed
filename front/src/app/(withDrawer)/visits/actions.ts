"use server";
import { FormState, VisitTemplate } from "@/lib/definitions";
import { fetchGet, fetchPost } from "@/lib/fetchWrap";
import z from "zod/v4";
import { Visit, visitErrors, VisitSchema } from "./types";

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
  console.dir(data, { depth: null });

  if (!validatedFields.success) {
    console.dir(`Validated Fields1:${validatedFields.error}`, { depth: null });
    return {
      errors: z.flattenError(validatedFields.error),
      inputs: data,
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

  // redirect("/patients");
}

export async function getVisitTemplate(
  templateId: number
): Promise<VisitTemplate | undefined> {
  const response = await fetchGet<VisitTemplate>(
    `/templates/get/${templateId}`,
    {
      withAuth: true,
    }
  );

  console.log("Visit Template Response:", response?.data);
  if (response.data) {
    return response.data;
  } else {
    console.error("Error fetching visit template: ", response.message);
  }
}
