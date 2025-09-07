import RequireRoles from "@/components/RequireRoles";
import VisitForm from "../_components/VisitForm";
import { patient, triage, visitTemplate } from "@/lib/actions";
import ErrorMessage from "@/components/ErrorMessage";
import { QueryClient } from "@tanstack/react-query";
import { PatientTabsProvider } from "../../patients/_components/PatientTabsProvider";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

export default async function CreateVisitPage({
  searchParams: params,
}: {
  searchParams: Promise<{ patientId?: number }>;
}) {
  await RequireRoles(["Medic"]);
  const patientId = (await params).patientId;
  if (!patientId) return <ErrorMessage />;

  const patientData = await patient.getById(patientId);
  if (!patientData) return <ErrorMessage />;

  const templateNames = await visitTemplate.getAll();
  if (!templateNames) return <ErrorMessage />;

  const template = await visitTemplate.getById(templateNames[0].id);
  if (!template) return <ErrorMessage />;

  const queryClient = new QueryClient();
  queryClient.setQueryData(["visitTemplateGet", template.id], template);

  const triageData = await triage.getByPatientId(patientId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2 pl-6 pt-6 text-center">
        Add a new visit
      </h1>

      <PatientTabsProvider
        value={{
          patient: patientData,
          template: template,
          templateNames: templateNames,
          triage: triageData,
        }}
      >
        <VisitForm className="w-full mx-auto max-w-3xl p-6 flex flex-col" />
      </PatientTabsProvider>
    </div>
  );
}
