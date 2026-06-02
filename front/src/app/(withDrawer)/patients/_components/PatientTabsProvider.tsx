"use client";
import { Patient } from "../types";
import { Triage } from "./triages/types";
import { VisitTemplate } from "../../templates/types";
import { createTypedContext } from "@/components/ContextFactory";

// Patient Tabs specific context
export type PatientTabsValue = {
  patient: Patient;
  template: VisitTemplate;
  templateNames: { id: number; name: string }[];
  triage: Triage | null;
};

const { Provider, useTypedContext, Context } =
  createTypedContext<PatientTabsValue>();

export const PatientTabsProvider = Provider;
export const usePatientTabsContext = useTypedContext;
export const PatientTabsContext = Context;
