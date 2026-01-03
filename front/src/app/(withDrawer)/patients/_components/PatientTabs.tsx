"use client";
import { useState } from "react";
import { usePatientTabsContext } from "./PatientTabsProvider";
import VisitListView from "./visits/VisitList";
import PatientForm from "./PatientForm";
import TriageForm from "./triages/TriageForm";
import { patient, triage } from "@/lib/actions";

export default function PatientTabs() {
  const ctx = usePatientTabsContext();
  const [activeTab, setActiveTab] = useState(0);

  const tabs: { label: string; content: React.ReactNode }[] = [
    {
      label: "Details",
      content: (
        <PatientForm
          className="p-6 bg-base-100 rounded-field max-w-3xl mx-auto"
          mutateAction={patient.update}
          patient={ctx.patient}
        />
      ),
    },
    {
      label: "New Triage",
      content: (
        <TriageForm
          className="p-6 bg-base-100 mx-auto max-w-3xl rounded-field"
          mutateAction={triage.create}
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
  ];

  return (
    <>
      <div className="tabs tabs-border border-b mb-6">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            className={`tab ${
              activeTab === index
                ? "tab-active text-primary hover:text-primary"
                : ""
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.find((_tab, index) => index === activeTab)?.content}
    </>
  );
}
