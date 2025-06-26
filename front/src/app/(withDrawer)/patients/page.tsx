import Link from "next/link";
import ConfirmModal from "../../../components/ConfirmModal";
import { PiWarningBold } from "react-icons/pi";
import { patientList, patientRemove } from "./actions";
import ErrorMessage from "@/components/ErrorMessage";

export default async function Page() {
  const patients = await patientList();
  if (patients.length === 0) return <ErrorMessage />;

  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>Nume</th>
          <th>Prenume</th>
          <th>Data nasterii</th>
          <th>Gen</th>
          <th>Telefon</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {patients.map((p) => (
          <tr key={p.id}>
            <td>{p.lastName}</td>
            <td>{p.firstName}</td>
            <td>{p.birthday.toString()}</td>
            <td>{p.gender}</td>
            <td>{p.phone}</td>
            <td>
              <Link href={`patients/${p.id}`} className="btn btn-primary mr-2">
                Edit
              </Link>
              <ConfirmModal
                toExecute={patientRemove}
                id={p.id}
                openButton="Delete"
                closeButton="Close"
                submitButton="Delete"
              >
                <h3 className="font-bold text-lg text-center">
                  Delete patient?
                </h3>
                <p className="py-4 text-gray-700 text-center">
                  Are you sure you want to delete this patient?
                </p>
                <div role="alert" className="alert alert-warning">
                  <PiWarningBold size={23} />
                  <span>Warning: This action cant be undone!</span>
                </div>
              </ConfirmModal>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
