import { patientGet } from "../actions";
import ErrorMessage from "@/components/ErrorMessage";
import PatientTabs from "../_components/PatientTabs";
import { PatientTabsProvider } from "../_components/PatientTabsProvider";
import RequireRoles from "@/components/RequireRoles";
import { visitTemplateGet } from "../_components/visits/actions";

export default async function PatientOptionsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  await RequireRoles(["Medic"]);

  const patientId = (await params).id;
  const patient = await patientGet(patientId);
  if (!patient) return <ErrorMessage />;

  const template = await visitTemplateGet();
  if (!template) return <ErrorMessage />;
  return (
    <div className="bg-base-100 rounded-field">
      <h1 className="text-2xl font-bold mb-2 pl-6 pt-6">{`${patient.firstName} ${patient.lastName}`}</h1>
      <PatientTabsProvider value={{ patient, template }}>
        <PatientTabs />
      </PatientTabsProvider>
    </div>
  );
}
