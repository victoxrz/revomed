"use server";
import axiosInstance from "@/lib/axiosConfig";
import { APIError } from "@/lib/errors";
import {
  VisitTemplate,
  VisitTemplateErrors,
  VisitTemplateSchema,
} from "../../app/(withDrawer)/templates/types";
import { FormState, GENERIC_ERROR_MESSAGE } from "@/lib/definitions";
import z from "zod/v4";

export async function create(
  _state: FormState<VisitTemplateErrors, VisitTemplate>,
  formData: FormData,
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

  try {
    await axiosInstance.post("/templates/create", validatedFields.data);

    return {
      inputs: null,
      message: "success",
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

export async function getById(id: number) {
  const response = await axiosInstance.get<VisitTemplate>(
    `/templates/get/${id}`,
    {
      fetchOptions: {
        next: {
          tags: [`/templates/get/${id}`],
          revalidate: 60 * 60,
        },
        cache: "force-cache",
      },
    },
  );

  return response.data;
}

export async function getAll(page: number, pageSize: number) {
  const response = await axiosInstance.get<{
    templates: { id: number; name: string }[];
    totalCount: number;
  }>("/templates/list", {
    params: {
      page: String(page),
      pageSize: String(pageSize),
    },
    fetchOptions: {
      next: {
        tags: [`/templates/list?page=${page}&pageSize=${pageSize}`],
        revalidate: 60 * 60,
      },
      cache: "force-cache",
    },
  });

  return response.data ?? { templates: [], totalCount: 0 };
}

export async function update(
  _state: FormState<VisitTemplateErrors, VisitTemplate>,
  formData: FormData,
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

  try {
    await axiosInstance.put(
      `/templates/update/${validatedFields.data.id}`,
      validatedFields.data,
    );

    return {
      inputs: validatedFields.data,
      message: "success",
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
