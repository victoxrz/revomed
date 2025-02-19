"use server";
import { cookies } from "next/headers";
import { SignupSchema, FormState, signupErrors } from "../../_lib/definitions";
import { redirect } from "next/navigation";

export async function signup(
  _state: FormState<signupErrors>,
  formData: FormData
): Promise<{ errors?: signupErrors } | undefined> {
  const validatedFields = SignupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten(),
    };
  }

  formData.delete("confirmPassword");
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(formData as unknown as Record<string, string>),
    });

    if (!response.ok) return;

    const data = await response.json();

    (await cookies()).set({
      name: process.env.AUTH_TOKEN_NAME!,
      value: data.token,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
  } catch (error) {
    console.error("Network error:", error);
    return;
  }
  redirect("/patients");
}
