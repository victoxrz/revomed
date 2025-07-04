import PatientForm from "../PatientForm";
import { patientCreate } from "../actions";

export default async function Page() {
  return (
    <div className="bg-base-100 rounded-field">
      <h1 className="text-2xl font-bold mb-2 pl-6 pt-6 text-center">
        Add a new patient
      </h1>
      <PatientForm toExecute={patientCreate} patient={null} />
    </div>
  );
}
