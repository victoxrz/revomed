"use client";
import { createContext, useContext } from "react";
import { Patient } from "../types";
import { VisitTemplate } from "./visits/types";

type PatientTabsValue =
  | {
      patient: Patient;
      template: VisitTemplate;
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
