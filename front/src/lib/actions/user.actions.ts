"use server";
import { FormState, GENERIC_ERROR_MESSAGE } from "@/lib/definitions";
import {
  UserErrors,
  UserSchema,
  UserModel,
  User,
} from "../../app/(withDrawer)/users/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod/v4";
import axiosInstance from "@/lib/axiosConfig";
import { APIError } from "@/lib/errors";

export async function update(
  _state: FormState<UserErrors, User>,
  formData: FormData,
): Promise<FormState<UserErrors, User>> {
  const data: User = Object.fromEntries(formData.entries()) as unknown as User;

  const validatedFields = UserSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error),
      inputs: data,
    };
  }

  try {
    await axiosInstance.put(`/users/update/${formData.get("id")}`, data);
  } catch (error) {
    return {
      inputs: validatedFields.data,
      message:
        error instanceof APIError ? error.message : GENERIC_ERROR_MESSAGE,
    };
  }

  revalidatePath("/users");
  redirect("/users");
}

export async function remove(
  _state: { message: string } | undefined,
  formData: FormData,
): Promise<{ message: string }> {
  try {
    await axiosInstance.delete(`/users/delete/${formData.get("id")}`);
  } catch (error) {
    return {
      message:
        error instanceof APIError ? error.message : GENERIC_ERROR_MESSAGE,
    };
  }

  revalidatePath("/users");
  redirect("/users");
}

export async function getAll(page: number, pageSize: number) {
  const response = await axiosInstance.get<{
    users: UserModel[];
    totalCount: number;
  }>(
    "/users/list?" +
      new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      }),
  );

  return response.data ?? { users: [], totalCount: 0 };
}

export async function getById(id: number) {
  const response = await axiosInstance.get<User>(`/users/get/${id}`);

  return response.data;
}
