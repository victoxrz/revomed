import PatientForm from "./PatientForm";
import { patientCreate, patientGet } from "../actions";
import ErrorMessage from "@/components/ErrorMessage";
import CreateVisitForm from "../../visits/VisitForm";
import { getVisitTemplate } from "@/app/(withDrawer)/visits/actions";

export default async function PatientOptionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const patient = await patientGet(Number((await params).id));
  const template = await getVisitTemplate(1);

  return (
    <div className="tabs tabs-border justify-between">
      <input
        type="radio"
        name="my_tabs"
        className="tab flex-1/2 text-primary checked:hover:text-primary"
        aria-label="Patient"
        defaultChecked
      />
      <div className="tab-content mt-6">
        {patient ? (
          <PatientForm
            className="border-base-300 border rounded-field"
            toExecute={patientCreate}
            patient={patient}
          />
        ) : (
          <ErrorMessage />
        )}
      </div>

      <input
        type="radio"
        name="my_tabs"
        className="tab flex-1/2 text-primary checked:hover:text-primary"
        aria-label="Visit"
      />
      <div className="tab-content mt-6">
        {template ? (
          <CreateVisitForm
            className="border-base-300 border rounded-field"
            titles={template.titles}
            patientId={(await params).id}
          />
        ) : (
          <ErrorMessage />
        )}
      </div>
    </div>
  );
}
