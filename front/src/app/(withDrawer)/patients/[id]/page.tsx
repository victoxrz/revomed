"use server";
import { cookies } from "next/headers";
import PatientForm from "./PatientForm";
import { Patient } from "@/app/_lib/definitions";
import { updatePatient } from "@/actions/PatientController";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let patient: Patient | null = null;
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/patients/get/${(await params).id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${
            (await cookies()).get(process.env.AUTH_TOKEN_NAME!)?.value
          }`,
        },
      }
    );
    if (!response.ok) {
      console.log(response.statusText, await response.text());
      return;
    }
    patient = await response.json();
  } catch (error) {
    console.error("Network error:", error);
  }

  if (!patient) {
    return <div className="p-4">Patient data could not be loaded.</div>;
  }

  return <PatientForm toExecute={updatePatient} patient={patient} />;
}
