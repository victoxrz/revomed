import { VisitTemplate } from "@/lib/actions";
import VisitTemplateForm from "../_components/VisitTemplateForm";
import RequireRoles from "@/components/RequireRoles";
import { ROUTES_ROLES } from "@/lib/dal/types";

export default async function CreateVisitTemplatePage() {
  await RequireRoles(ROUTES_ROLES.TEMPLATES.CREATE);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2 pl-6 pt-6 text-center">
        Add a new visit template
      </h1>
      <VisitTemplateForm mutateAction={VisitTemplate.create} template={null} />
    </div>
  );
}
