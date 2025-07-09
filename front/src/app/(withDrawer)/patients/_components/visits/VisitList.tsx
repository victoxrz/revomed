import { useQuery } from "@tanstack/react-query";
import { VisitGet } from "./actions";
import { usePatientTabsContext } from "../PatientTabsProvider";

export interface VisitItem {
  id: number;
  createdAt: string;
  titles: string[];
  fields: string[];
}

export default function VisitListView() {
  const patient = usePatientTabsContext().patient;

  const { data: visitList, isLoading } = useQuery<VisitItem[]>({
    queryKey: ["/visits/get", patient.id],
    queryFn: async () => (await VisitGet(patient.id)) ?? [],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading)
    return (
      // modify the skeleton once decided with the view page
      <>
        <div className="skeleton bg-base-200 animate-pulse w-full mx-auto max-w-2xl h-40"></div>
        <div className="skeleton bg-base-200 animate-pulse w-full mx-auto mt-6 max-w-2xl h-40"></div>
      </>
    );

  if (visitList?.length === 0)
    return (
      <p className="prose-sm mx-auto text-center">
        No previous visits has been found.
      </p>
    );

  return visitList?.map((visit, index) => (
    <VisitItemView
      className={index !== visitList?.length - 1 ? "mb-4" : undefined}
      key={index}
      visit={visit}
    />
  ));
}

function VisitItemView({
  className,
  visit,
}: {
  className?: string;
  visit: VisitItem;
}) {
  return (
    <div
      className={`mx-auto rounded-field border w-full max-w-2xl p-6 ${className}`}
    >
      {visit.titles.map((title, index) => (
        <div
          className={
            (index !== visit.titles.length - 1 ? "mb-4" : undefined) + " prose"
          }
          key={index}
        >
          <h4>{title}</h4>
          <p className="prose-sm">{visit.fields[index]}</p>
        </div>
      ))}
      <p className="text-right prose max-w-full prose-sm">
        {new Date(visit.createdAt).toLocaleDateString("ro-md")}
      </p>
    </div>
  );
}
