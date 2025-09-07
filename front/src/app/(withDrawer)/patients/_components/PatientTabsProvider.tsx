"use client";
import { createContext, useContext } from "react";
import { Patient } from "../types";
import { Triage } from "./triages/types";
import { VisitTemplate } from "../../templates/types";

export type PatientTabsValue =
  | {
      patient: Patient;
      template: VisitTemplate;
      templateNames: { id: number; name: string }[];
      triage: Triage | null;
    }
  | undefined;

export const PatientTabsContext = createContext<PatientTabsValue>(undefined);

export function PatientTabsProvider({
  children,
  value,
}: {
  children: Readonly<React.ReactNode>;
  value: PatientTabsValue;
}) {
  return <PatientTabsContext value={value}>{children}</PatientTabsContext>;
}

export function usePatientTabsContext() {
  const ctx = useContext(PatientTabsContext);

  if (!ctx) throw Error("Undefined context value. Use inside Context Provider");
  return ctx;
}
