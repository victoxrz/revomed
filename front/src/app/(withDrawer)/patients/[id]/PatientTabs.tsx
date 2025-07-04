"use client";
import { VisitItem } from "../types";
import { useState } from "react";
import PatientForm from "../PatientForm";
import { patientUpdate } from "../actions";
import { useQuery } from "@tanstack/react-query";
import CreateVisitForm from "../../visits/VisitForm";
import VisitItemView from "./VisitItem";
import { usePatientTabsContext } from "./context";

export function VisitList() {
  const patient = usePatientTabsContext().patient;

  const { data: visitList, isLoading } = useQuery<VisitItem[]>({
    queryKey: ["/patients/api"],
    queryFn: () =>
      fetch(`/patients/api?patientId=${patient.id}`).then((res) => res.json()),
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
    { label: "History", content: <VisitList /> },
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
