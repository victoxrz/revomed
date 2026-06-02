import RequireRoles from "@/components/RequireRoles";
import VisitListView from "../../patients/_components/visits/VisitList";
import { ProfileGet } from "../../profile/actions";
import ErrorMessage from "@/components/ErrorMessage";
import { Patient } from "../../patients/types";
import FormLabel from "@/components/FormLabel";
import { IoSearch } from "react-icons/io5";
import { ROUTES_ROLES } from "@/lib/dal/types";

export default async function VisitsHistoryPage() {
  await RequireRoles(ROUTES_ROLES.VISITS.ME);

  const patient = await ProfileGet();
  if (patient?.userRole !== "Patient") return <ErrorMessage />;

  return (
    <div>
      <FormLabel className="input mb-4">
        <IoSearch size={19} />
        <input type="search" id="search" required placeholder="Search" />
      </FormLabel>
      <VisitListView
        patient={patient as unknown as Patient}
        className="bg-base-100 rounded-field divide-y"
      />
    </div>
  );
}
