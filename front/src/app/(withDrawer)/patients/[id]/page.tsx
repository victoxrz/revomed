import ErrorMessage from "@/components/ErrorMessage";
import PatientTabs from "../_components/PatientTabs";
import RequireRoles from "@/components/RequireRoles";
import PatientOptions from "../_components/PatientOptions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Patient, VisitTemplate } from "@/lib/actions";
import { Triage } from "@/lib/actions";
import Link from "next/link";
import { PatientTabsProvider } from "../_components/PatientTabsProvider";
import { ROUTES_ROLES } from "@/lib/dal/types";

export default async function PatientOptionsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  await RequireRoles(ROUTES_ROLES.PATIENTS.GET);

  const patientId = (await params).id;
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
