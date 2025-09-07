"use client";
import { createContext, useContext } from "react";
import { VisitTemplate } from "../../templates/types";
import { Triage } from "../../patients/_components/triages/types";

export type VisitCtxValue =
  | {
      patientId: number;
      template: VisitTemplate;
      templateNames: { id: number; name: string }[];
      triage: Triage | null;
    }
  | undefined;

export const VisitContext = createContext<VisitCtxValue>(undefined);

export function VisitProvider({
  children,
  value,
}: {
  children: Readonly<React.ReactNode>;
  value: VisitCtxValue;
}) {
  return <VisitContext value={value}>{children}</VisitContext>;
}

export function useVisitContext() {
  const ctx = useContext(VisitContext);

  if (!ctx) throw Error("Undefined context value. Use inside Context Provider");
  return ctx;
}
