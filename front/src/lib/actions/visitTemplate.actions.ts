"use server";
import { fetchClient } from "@/lib/actions";
import {
  VisitTemplate,
  VisitTemplateErrors,
  VisitTemplateSchema,
} from "../../app/(withDrawer)/templates/types";
import { FormState } from "@/lib/definitions";
import z from "zod/v4";

export async function create(
  _state: FormState<VisitTemplateErrors, VisitTemplate>,
  formData: FormData
): Promise<FormState<VisitTemplateErrors, VisitTemplate>> {
  const data: VisitTemplate = {
    id: Number(formData.get("id")),
    name: formData.get("name") as string,
    requireTriage: formData.get("requireTriage") as unknown as boolean,
    titles: (formData.getAll("titles") as string[]).map((e, i) => [
      e,
      ...(formData.getAll(`titles-${i}`) as string[]),
    ]),
  };

  const validatedFields = VisitTemplateSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error),
      inputs: data,
    };
  }

  const response = await fetchClient.post(
    "/templates/create",
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

  return {
    inputs: null,
    message: "success",
    isSuccessful: true,
  };
}

export async function getById(id: number) {
  const response = await fetchClient.get<VisitTemplate>(
    `/templates/get/${id}`,
    {
      withAuth: true,
      // cache: "force-cache",
    }
  );

  return response.data;
}

export async function getAll() {
  const response = await fetchClient.get<{ id: number; name: string }[]>(
    "/templates/list",
    {
      withAuth: true,
      // cache: "force-cache",
    }
  );

  return response.data;
}

export async function update(
  _state: FormState<VisitTemplateErrors, VisitTemplate>,
  formData: FormData
): Promise<FormState<VisitTemplateErrors, VisitTemplate>> {
  const data: VisitTemplate = {
    id: Number(formData.get("id")),
    name: formData.get("name") as string,
    requireTriage: formData.get("requireTriage") === "on",
    titles: (formData.getAll("titles") as string[]).map((e, i) => [
      e,
      ...(formData.getAll(`titles-${i}`) as string[]),
    ]),
  };

  const validatedFields = VisitTemplateSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error),
      inputs: data,
    };
  }

  const response = await fetchClient.put(
    `/templates/update/${validatedFields.data.id}`,
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

  return {
    inputs: validatedFields.data,
    message: "success",
    isSuccessful: true,
  };
}
