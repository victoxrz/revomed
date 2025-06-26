import PatientForm from "../[id]/PatientForm";
import { patientCreate } from "../actions";

export default async function Page() {
  return (
    <PatientForm
      toExecute={patientCreate}
      patient={{
        id: 0,
        lastName: "",
        firstName: "",
        patronymic: "",
        gender: "Male",
        bloodType: "A+",
        birthday: "1899-12-31",
        idnp: "",
        phone: "",
        job: "",
        streetAddress: "",
        country: "",
      }}
    />
  );
}
