import RequireRoles from "@/components/RequireRoles";
import VisitForm from "../_components/VisitForm";
import { Patient, Triage, VisitTemplate } from "@/lib/actions";
import ErrorMessage from "@/components/ErrorMessage";
import { QueryClient } from "@tanstack/react-query";
import { PatientTabsProvider } from "../../patients/_components/PatientTabsProvider";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { ROUTES_ROLES } from "@/lib/dal/types";

export default async function CreateVisitPage({
  searchParams: params,
}: {
  searchParams: Promise<{ patientId?: number }>;
}) {
  await RequireRoles(ROUTES_ROLES.VISITS.CREATE);

  const patientId = (await params).patientId;
  if (!patientId) return <ErrorMessage />;

  const patientData = await Patient.getById(patientId);
  if (!patientData) return <ErrorMessage />;

  const templateNames = (await VisitTemplate.getAll(1, 50)).templates;
  if (!templateNames) return <ErrorMessage />;

  const template = await VisitTemplate.getById(templateNames[0].id);
  if (!template) return <ErrorMessage />;

  const queryClient = new QueryClient();
  queryClient.setQueryData(["visitTemplateGet", template.id], template);

  const triageData = await Triage.getByPatientId(patientId);

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
