import ErrorMessage from "@/components/ErrorMessage";
import PatientTabs from "../_components/PatientTabs";
import { PatientTabsProvider } from "../_components/PatientTabsProvider";
import RequireRoles from "@/components/RequireRoles";
import PatientOptions from "../_components/PatientOptions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { patient, visitTemplate } from "@/lib/actions";
import { triage } from "@/lib/actions";
import Link from "next/link";

export default async function PatientOptionsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  await RequireRoles(["Medic"]);

  const patientId = (await params).id;
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
      <PatientTabsProvider
        value={{
          patient: patientData,
          template,
          templateNames,
          triage: triageData,
        }}
      >
        <div className="flex items-center justify-between p-6 mb-3 bg-base-100 rounded-field">
          <h1>{`${patientData.firstName} ${patientData.lastName}`}</h1>
          <div>
            <Link
              href={{
                pathname: `/visits/create`,
                query: { patientId: patientId },
              }}
              className="btn btn-primary"
            >
              New visit
            </Link>
            <PatientOptions patient={patientData} />
          </div>
        </div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PatientTabs />
        </HydrationBoundary>
      </PatientTabsProvider>
    </div>
  );
}
