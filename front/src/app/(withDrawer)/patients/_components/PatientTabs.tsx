"use client";
import VisitListView from "./visits/VisitList";
import PatientForm from "./PatientForm";
import TriageForm from "./triages/TriageForm";
import { Patient, Triage } from "@/lib/actions";
import { usePatientTabsContext } from "./PatientTabsProvider";
import EntityTabs from "@/components/EntityTabs";

export default function PatientTabs() {
  const ctx = usePatientTabsContext();

  return (
    <EntityTabs
      tabs={[
        {
          label: "Details",
          content: (
            <PatientForm
              className="p-6 bg-base-100 rounded-field max-w-3xl mx-auto"
              mutateAction={Patient.update}
              patient={ctx.patient}
            />
          ),
        },
        {
          label: "New Triage",
          content: (
            <TriageForm
              className="p-6 bg-base-100 mx-auto max-w-3xl rounded-field"
              mutateAction={Triage.create}
              triage={null}
            />
          ),
        },
        {
          label: "Visits history",
          content: (
            <VisitListView
              className="rounded-field bg-base-100 divide-y"
              patient={ctx.patient}
            />
          ),
        },
      ]}
    />
  );
}
