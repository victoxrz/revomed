import ErrorMessage from "@/components/ErrorMessage";
import { visitTemplate } from "@/lib/actions";
import VisitTemplateForm from "../_components/VisitTemplateForm";

export default async function VisitTemplatePage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const template = await visitTemplate.getById((await params).id);
  if (!template) return <ErrorMessage />;

  return (
    <div className="bg-base-100 rounded-field">
      <h1 className="text-2xl font-bold mb-2 pl-6 pt-6 text-center">
        {template.name}
      </h1>
      <VisitTemplateForm
        mutateAction={visitTemplate.update}
        template={template}
      />
    </div>
  );
}
