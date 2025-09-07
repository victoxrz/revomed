import Link from "next/link";
import ConfirmModal from "../../../components/ConfirmModal";
import { PiWarningBold } from "react-icons/pi";
import ErrorMessage from "@/components/ErrorMessage";
import RequireRoles from "@/components/RequireRoles";
import { patient } from "@/lib/actions";
import FormLabel from "@/components/FormLabel";
import { IoSearch } from "react-icons/io5";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await RequireRoles(["Medic"]);

  const { page } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;

  const response = await patient.getAll(currentPage, 50);
  const patients = response.patients;
  const lastPage = Math.ceil(response.totalCount / 50);
  if (patients.length === 0) return <ErrorMessage />;

  return (
    <div>
      <FormLabel className="input mb-4">
        <IoSearch size={19} />
        <input type="search" id="search" required placeholder="Search" />
      </FormLabel>

      <table className="table w-full bg-base-100 rounded-field">
        <thead>
          <tr>
            <th>Last name</th>
            <th>First name</th>
            <th>Birthday</th>
            <th>Gender</th>
            <th>Phone</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.lastName}</td>
              <td>{p.firstName}</td>
              <td>{new Date(p.birthday).toLocaleDateString("ro-md")}</td>
              <td>{p.gender}</td>
              <td>{p.phone}</td>
              <td>
                <Link
                  href={`/patients/${p.id}`}
                  className="btn btn-primary m-2"
                >
                  More
                </Link>
                <ConfirmModal
                  mutateAction={patient.remove}
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
      <div className="w-full bg-base-100 my-4 rounded-field flex">
        <section className="flex gap-2 items-center pl-2">
          <h4>Total</h4>
          <p>{response.totalCount}</p>
        </section>
        <div className="menu menu-horizontal ml-auto">
          <li>
            <Link href={`/patients?page=1`} className="rounded-full w-8 h-8">
              «
            </Link>
          </li>
          <li className={currentPage <= 1 ? "menu-disabled" : ""}>
            <Link
              href={`/patients?page=${currentPage - 1}`}
              className="rounded-full w-8 h-8"
            >
              ‹
            </Link>
          </li>
          <li>
            <button className="menu-active rounded-full w-8 h-8">
              {currentPage}
            </button>
          </li>
          <li className={currentPage >= lastPage ? "menu-disabled" : ""}>
            <Link
              href={`/patients?page=${currentPage + 1}`}
              className="rounded-full w-8 h-8"
            >
              ›
            </Link>
          </li>
          <li>
            <Link
              href={`/patients?page=${lastPage}`}
              className="rounded-full w-8 h-8"
            >
              »
            </Link>
          </li>
        </div>
      </div>
    </div>
  );
}
