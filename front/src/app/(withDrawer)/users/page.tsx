import Link from "next/link";
import ConfirmModal from "../../../components/ConfirmModal";
import { PiWarningBold } from "react-icons/pi";
import ErrorMessage from "@/components/ErrorMessage";
import RequireRoles from "@/components/RequireRoles";
import { User } from "@/lib/actions";
import FormLabel from "@/components/FormLabel";
import { IoSearch } from "react-icons/io5";
import { ROUTES_ROLES } from "@/lib/dal/types";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await RequireRoles(ROUTES_ROLES.USERS.LIST);

  const { page } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;

  const response = await User.getAll(currentPage, 50);
  const users = response.users;
  const lastPage = Math.ceil(response.totalCount / 50);
  if (users.length === 0) return <ErrorMessage />;

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
            <th>Email</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.lastName}</td>
              <td>{u.firstName}</td>
              <td>{u.email}</td>
              <td>{u.userRole}</td>
              <td>
                <Link href={`/users/${u.id}`} className="btn btn-primary m-2">
                  Edit
                </Link>
                <ConfirmModal
                  mutateAction={User.remove}
                  id={u.id}
                  openButton="Delete"
                  closeButton="Close"
                  submitButton="Delete"
                >
                  <h3 className="font-bold text-lg text-center">
                    Delete user?
                  </h3>
                  <p className="py-4 text-gray-700 text-center">
                    Are you sure you want to delete this user?
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
            <Link href={`/users?page=1`} className="rounded-full w-8 h-8">
              «
            </Link>
          </li>
          <li className={currentPage <= 1 ? "menu-disabled" : ""}>
            <Link
              href={`/users?page=${currentPage - 1}`}
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
              href={`/users?page=${currentPage + 1}`}
              className="rounded-full w-8 h-8"
            >
              ›
            </Link>
          </li>
          <li>
            <Link
              href={`/users?page=${lastPage}`}
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
