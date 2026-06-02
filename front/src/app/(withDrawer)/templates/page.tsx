import Link from "next/link";
import ErrorMessage from "@/components/ErrorMessage";
import { VisitTemplate } from "@/lib/actions";
import FormLabel from "@/components/FormLabel";
import { IoSearch } from "react-icons/io5";
import RequireRoles from "@/components/RequireRoles";
import { ROUTES_ROLES } from "@/lib/dal/types";

export default async function TemplatesTablePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await RequireRoles(ROUTES_ROLES.TEMPLATES.LIST);

  const { page } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;

  const response = await VisitTemplate.getAll(currentPage, 50);

  const templates = response.templates;
  const lastPage = Math.ceil(response.totalCount / 50);
  if (templates.length === 0) return <ErrorMessage />;

  return (
    <div>
      <FormLabel className="input mb-4">
        <IoSearch size={19} />
        <input type="search" id="search" required placeholder="Search" />
      </FormLabel>

      <table className="table w-full bg-base-100 rounded-field">
        <thead>
          <tr>
            <th>Title</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {templates.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td className="text-end">
                <Link
                  href={`/templates/${p.id}`}
                  className="btn btn-primary m-2"
                >
                  More
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full bg-base-100 my-4 rounded-field flex">
        <section className="flex gap-2 items-center pl-2">
          <h4>Total</h4>
          <p>{response?.totalCount}</p>
        </section>
        <div className="menu menu-horizontal ml-auto">
          <li>
            <Link href={`/templates?page=1`} className="rounded-full w-8 h-8">
              «
            </Link>
          </li>
          <li className={currentPage <= 1 ? "menu-disabled" : ""}>
            <Link
              href={`/templates?page=${currentPage - 1}`}
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
              href={`/templates?page=${currentPage + 1}`}
              className="rounded-full w-8 h-8"
            >
              ›
            </Link>
          </li>
          <li>
            <Link
              href={`/templates?page=${lastPage}`}
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
