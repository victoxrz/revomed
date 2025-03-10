"use server";
import {
  patientErrors,
  PatientSchema,
  FormState,
} from "@/app/_lib/definitions";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// https://sqids.org/

async function savePatient(
  formData: FormData,
  method: "POST" | "PUT"
): Promise<{ errors?: patientErrors } | undefined> {
  const url = method === "POST" ? "/create" : `/update/${formData.get("id")}`;

  const validatedFields = PatientSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten(),
    };
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/patients${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          (await cookies()).get(process.env.AUTH_TOKEN_NAME!)?.value
        }`,
      },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });

    if (!response.ok) return;
  } catch (error) {
    console.error("Network error:", error);
    return;
  }
}

export async function createPatient(
  _state: FormState<patientErrors>,
  formData: FormData
): Promise<{ errors?: patientErrors } | undefined> {
  const result = savePatient(formData, "POST");
  const errors = (await result)?.errors;
  if (errors != undefined) {
    return {
      errors: errors,
    };
  }
  redirect("/patients");
}

export async function updatePatient(
  _state: FormState<patientErrors>,
  formData: FormData
): Promise<{ errors?: patientErrors } | undefined> {
  const result = savePatient(formData, "PUT");
  const errors = (await result)?.errors;
  if (errors != undefined) {
    return {
      errors: errors,
    };
  }

  revalidatePath("/patients");
  redirect("/patients");
}

export async function deletePatient(formData: FormData) {
  // if (!confirm("are you sure?")) {
  //   return;
  // }
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/patients/delete/${formData.get("id")}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${
            (await cookies()).get(process.env.AUTH_TOKEN_NAME!)?.value
          }`,
        },
      }
    );

    if (!response.ok) {
      return;
    }
  } catch (error) {
    console.error("Error deleting patient:", error);
    return;
  }

  revalidatePath("/patients");
  redirect("/patients");
}
