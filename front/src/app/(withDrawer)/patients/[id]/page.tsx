import { patientGet } from "../actions";
import ErrorMessage from "@/components/ErrorMessage";
import PatientTabs from "./PatientTabs";
import { decodeToken } from "@/lib/dal";
import { VisitTemplate } from "@/lib/definitions";
import { fetchGet } from "@/lib/fetchWrap";
import { PatientTabsProvider } from "./context";

async function visitTemplateGet() {
  const payload = await decodeToken();
  if (!payload) return;

  const response = await fetchGet<VisitTemplate>(
    `/templates/get/${payload.templateId}`,
    {
      withAuth: true,
    }
  );

  if (response.data) {
    return response.data;
  } else {
    console.error("Error fetching visit template: ", response.message);
  }
}

export default async function PatientOptionsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
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
