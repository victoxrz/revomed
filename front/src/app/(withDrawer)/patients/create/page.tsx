"use server";
import { createPatient } from "@/actions/PatientController";
import PatientForm from "../[id]/PatientForm";

export default async function Page() {
  return <PatientForm toExecute={createPatient} patient={null} />;
}
