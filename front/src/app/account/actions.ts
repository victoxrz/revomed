"use server";
import { cookies } from "next/headers";
import {
  LoginSchema,
  loginErrors,
  Login,
  signupErrors,
  Signup,
  SignupSchema,
} from "./types";
import { redirect } from "next/navigation";
import z from "zod/v4";
import { fetchPost } from "@/lib/fetchWrap";
import { FormState } from "@/lib/definitions";

export async function login(
  _state: FormState<loginErrors, Login>,
  formData: FormData
): Promise<FormState<loginErrors, Login>> {
  const data: Login = Object.fromEntries(formData.entries()) as Login;
  const validatedFields = LoginSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error),
      inputs: data,
    };
  }

  const response = await fetchPost<{ token: string }>(
    "/users/login",
    new URLSearchParams(validatedFields.data),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (response.message)
    return {
      message: response.message,
      inputs: validatedFields.data,
    };

  if (response.data)
    (await cookies()).set({
      name: process.env.AUTH_TOKEN_NAME!,
      value: response.data.token,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

  redirect("/");
}

export async function signup(
  _state: FormState<signupErrors, Signup>,
  formData: FormData
): Promise<FormState<signupErrors, Signup>> {
  const data: Signup = Object.fromEntries(formData.entries()) as Signup;
  const validatedFields = SignupSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error),
      inputs: data,
    };
  }

  formData.delete("confirmPassword");

  const response = await fetchPost<{ token: string }>(
    "/users/signup",
    new URLSearchParams(validatedFields.data),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (response.message)
    return {
      message: response.message,
      inputs: validatedFields.data,
    };

  if (response.data)
    (await cookies()).set({
      name: process.env.AUTH_TOKEN_NAME!,
      value: response.data.token,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

  redirect("/patients");
}
