import { getVisitTemplate } from "@/app/(withDrawer)/visits/actions";
import CreateVisitForm from "../VisitForm";
import ErrorMessage from "@/components/ErrorMessage";

export default async function CreateVisitPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const template = await getVisitTemplate(1);
  if (!template) return <ErrorMessage />;

  const patientId = (await searchParams).patientId;
  if (!patientId) return <ErrorMessage />;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add new visit</h1>
      <CreateVisitForm titles={template.titles} patientId={patientId} />
    </div>
  );
}
