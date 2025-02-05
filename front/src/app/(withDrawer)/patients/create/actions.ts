"use server";
import { createErrors, CreateSchema, FormState } from "@/app/_lib/definitions";
import { cookies } from "next/headers";

export async function create(
  _state: FormState<createErrors>,
  formData: FormData
): Promise<{ errors?: createErrors } | undefined> {
  const validatedFields = CreateSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten(),
    };
  }

  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/patients/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${
            (await cookies()).get(process.env.AUTH_TOKEN_NAME!)?.value
          }`,
        },
        body: new URLSearchParams(
          formData as unknown as Record<string, string>
        ),
      }
    );

    if (!response.ok) return;

    const data = await response.json();
  } catch (error) {
    console.error("Network error:", error);
    return;
  }
}
