import { visitTemplate } from "@/lib/actions";
import VisitTemplateForm from "../_components/VisitTemplateForm";

export default async function CreateVisitTemplatePage() {
  return (
    <div className="bg-base-100 rounded-field">
      <h1 className="text-2xl font-bold mb-2 pl-6 pt-6 text-center">
        Add a new visit template
      </h1>
      <VisitTemplateForm mutateAction={visitTemplate.create} template={null} />
    </div>
  );
}
