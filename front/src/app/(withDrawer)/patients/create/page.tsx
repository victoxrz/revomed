import RequireRoles from "@/components/RequireRoles";
import PatientForm from "../_components/PatientForm";
import { patientCreate } from "../actions";

export default async function CreatePatientPage() {
  await RequireRoles(["Medic"]);
  return (
    <div className="bg-base-100 rounded-field">
      <h1 className="text-2xl font-bold mb-2 pl-6 pt-6 text-center">
        Add a new patient
      </h1>
      <PatientForm toExecute={patientCreate} patient={null} />
    </div>
  );
}
