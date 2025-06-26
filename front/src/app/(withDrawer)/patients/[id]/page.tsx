import PatientForm from "./PatientForm";
import Link from "next/link";
import { patientUpdate } from "../actions";
import { Patient } from "../types";
import { fetchGet } from "@/lib/fetchWrap";
import ErrorMessage from "@/components/ErrorMessage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const response = await fetchGet<Patient>(
    `/patients/get/${(await params).id}`,
    { withAuth: true }
  );

  if (!response.data) return <ErrorMessage />;

  return (
    <>
      <PatientForm toExecute={patientUpdate} patient={response.data} />
      <Link
        className="btn btn-primary"
        href={{
          pathname: "/visits/create",
          query: { patientId: response.data.id },
        }}
      >
        Add visit
      </Link>
    </>
  );
}
