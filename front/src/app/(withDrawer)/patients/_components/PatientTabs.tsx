"use client";
import { useState } from "react";
import { patientUpdate } from "../actions";
import CreateVisitForm from "./visits/VisitForm";
import { usePatientTabsContext } from "./PatientTabsProvider";
import VisitListView from "./visits/VisitList";
import PatientForm from "./PatientForm";

export default function PatientTabs() {
  const [activeTab, setActiveTab] = useState(2);

  const tabs: { label: string; content: React.ReactNode }[] = [
    {
      label: "Details",
      content: (
        <PatientForm
          toExecute={patientUpdate}
          patient={usePatientTabsContext().patient}
        />
      ),
    },
    {
      label: "New Visit",
      content: <CreateVisitForm />,
    },
    { label: "History", content: <VisitListView /> },
  ];

  return (
    <>
      <div className="tabs tabs-border border-b pl-6">
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
      <div className="mx-auto py-6">
        {tabs.find((_tab, index) => index === activeTab)?.content}
      </div>
    </>
  );
}
