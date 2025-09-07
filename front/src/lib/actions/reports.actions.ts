"use server";
import { cookies } from "next/headers";

export async function reportVisit(id: number) {
  const response = await fetch(
    `${process.env.API_BASE_URL!}/reports/visits/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          (await cookies()).get(process.env.AUTH_TOKEN_NAME!)?.value
        }`,
      },
    }
  );

  return response.blob();
}

export async function reportMedical(patientId: number) {
  const response = await fetch(
    `${process.env.API_BASE_URL!}/reports/medical/${patientId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          (await cookies()).get(process.env.AUTH_TOKEN_NAME!)?.value
        }`,
      },
    }
  );

  return response.blob();
}
