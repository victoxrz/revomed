"use client";
import { useQuery } from "@tanstack/react-query";
import { visit } from "@/lib/actions";
import { Triage } from "../triages/types";
import TriageView from "../triages/TriageView";
import { IoPrintSharp } from "react-icons/io5";
import Link from "next/link";
import { Patient } from "../../types";

export interface TriageItem {
  temperature: number;
  systolicPressure: number;
  diastolicPressure: number;
  heartRate: number;
  respiratoryRate: number;
  weight: number;
  waistCircumference: number;
  height: number;
}

export interface VisitItem {
  id: number;
  createdAt: string;
  titles: string[][];
  fields: Record<string, string>;
  medic: {
    firstName: string;
    lastName: string;
    specialty: string;
  };
  triage?: Triage;
}

export default function VisitListView({
  className,
  patient,
}: {
  className?: string;
  patient: Patient;
}) {
  const { data: visitList, isLoading } = useQuery<VisitItem[]>({
    queryKey: ["/visits/getByPatientId", patient.id],
    queryFn: async () => (await visit.getByPatientId(patient.id)) ?? [],
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  if (isLoading)
    return (
      // TODO: modify the skeleton once decided with the view page
      <>
        <div className="skeleton bg-base-300 animate-pulse w-full mx-auto h-40"></div>
        <div className="skeleton bg-base-300 animate-pulse w-full mx-auto mt-6 h-40"></div>
      </>
    );

  if (visitList?.length === 0)
    return (
      <div role="alert" className="alert alert-info alert-soft">
        No previous visits has been found.
      </div>
    );

  return (
    <div className={className}>
      {visitList?.map((visit) => (
        <VisitItemView key={visit.id} visit={visit} />
      ))}
    </div>
  );
}

function VisitItemView({
  className = "",
  visit,
}: {
  className?: string;
  visit: VisitItem;
}) {
  let content: React.ReactNode[] = [];

  Object.keys(visit.fields).forEach((k) => {
    const [i0, i1] = k.split("-").map((v) => Number(v));
    content.push(
      <div key={k}>
        {i1 <= 1 && <h3>{visit.titles[i0][0]}</h3>}
        {i1 > 0 && <h4>{visit.titles[i0][i1]}</h4>}
        <p>{visit.fields[k]}</p>
      </div>,
    );
  });

  return (
    <div className={`mx-auto w-full p-6 ${className}`}>
      <Link
        target="_blank"
        href={{ pathname: "/docs/visit-report/" + visit.id }}
        className="btn btn-ghost btn-square btn-sm -ml-1"
      >
        <IoPrintSharp size={19} />
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">{content}</div>
        {visit.triage && (
          <div className="border rounded-field p-6 mb-4">
            <h3>Vitals</h3>
            <TriageView triage={visit.triage} />
          </div>
        )}
      </div>
      <p className="flex justify-between items-center max-w-full">
        <span>{`${visit.medic.firstName} ${visit.medic.lastName}, ${visit.medic.specialty}`}</span>
        <span>{new Date(visit.createdAt).toLocaleString("ro-md")}</span>
      </p>
    </div>
  );
}

/**
 * <section
          aria-labelledby="triage-heading"
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 max-w-md"
        >
          <div className="flex items-baseline justify-between mb-2">
            <h3
              id="triage-heading"
              className="text-sm font-semibold text-gray-900"
            >
              title
            </h3>
            <span className="text-xs text-gray-500">vitals</span>
          </div>

          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {visit.triage &&
              Object.keys(visit.triage).map((k) => (
                <div key={k} className="p-2 bg-gray-50 rounded">
                  <dt className="text-xs text-gray-600">{LABELS[k]}</dt>
                  <dd
                    className="mt-1 text-sm font-medium text-gray-900"
                    aria-label={`${LABELS[k]} value`}
                  >
                    {fmt(visit.triage[k] as number | undefined, k)}
                  </dd>
                </div>
              ))}
          </dl>
        </section>
 * 
 */
