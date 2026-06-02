import ErrorMessage from "@/components/ErrorMessage";
import { VisitTemplate } from "@/lib/actions";
import VisitTemplateForm from "../_components/VisitTemplateForm";
import RequireRoles from "@/components/RequireRoles";
import { ROUTES_ROLES } from "@/lib/dal/types";

export default async function VisitTemplatePage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  await RequireRoles(ROUTES_ROLES.TEMPLATES.GET);

  const template = await VisitTemplate.getById((await params).id);
  if (!template) return <ErrorMessage />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2 pl-6 pt-6 text-center">
        {template.name}
      </h1>
      <VisitTemplateForm
        mutateAction={VisitTemplate.update}
        template={template}
      />
    </div>
  );
}
