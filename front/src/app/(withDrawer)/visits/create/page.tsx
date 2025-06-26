import { getVisitTemplate } from "@/actions/VisitController";
import CreateVisitForm from "../_form";
import ErrorMessage from "@/components/ErrorMessage";

export default async function CreateVisitPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const titles = (await getVisitTemplate(1)).titles;
  if (titles.length === 0) return <ErrorMessage />;

  const patientId = (await searchParams).patientId;
  if (!patientId) return <ErrorMessage />;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add new visit</h1>
      <CreateVisitForm titles={titles} patientId={patientId} />
    </div>
  );
}
