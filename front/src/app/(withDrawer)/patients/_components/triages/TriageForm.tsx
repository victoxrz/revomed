"use client";
import { useActionState, useEffect } from "react";
import { FormState } from "@/lib/definitions";
import toast from "react-hot-toast";
import FormLabel from "@/components/FormLabel";
import { FaSave } from "react-icons/fa";
import { Triage, TriageErrors } from "./types";
import { usePatientTabsContext } from "../PatientTabsProvider";

export default function TriageForm({
  className,
  mutateAction,
  triage,
}: {
  className?: string;
  mutateAction: (
    _state: FormState<TriageErrors, Triage>,
    formData: FormData
  ) => Promise<FormState<TriageErrors, Triage>>;
  triage: Triage | null;
}) {
  const [state, action] = useActionState(mutateAction, {
    inputs: triage,
    message: "",
  });

  useEffect(() => {
    if (state.message) {
      if (state.isSuccesful) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  const fieldErrors = state.errors?.fieldErrors || {};

  return (
    <form className={className} action={action}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="hidden" name="id" value={triage?.id} />
        <input
          type="hidden"
          name="patientId"
          value={usePatientTabsContext().patient.id}
        />

        <FormLabel label="Temperature (°C)" error={fieldErrors.temperature}>
          <div className="input flex mb-4 w-full">
            <input
              name="temperature"
              type="number"
              step="0.01"
              defaultValue={state.inputs?.temperature}
              required
            />
          </div>
        </FormLabel>

        <FormLabel
          label="Systolic Pressure (mmHg)"
          error={fieldErrors.systolicPressure}
        >
          <div className="input flex mb-4 w-full">
            <input
              name="systolicPressure"
              type="number"
              defaultValue={state.inputs?.systolicPressure}
              required
            />
          </div>
        </FormLabel>

        <FormLabel
          label="Diastolic Pressure (mmHg)"
          error={fieldErrors.diastolicPressure}
        >
          <div className="input flex mb-4 w-full">
            <input
              name="diastolicPressure"
              type="number"
              defaultValue={state.inputs?.diastolicPressure}
              required
            />
          </div>
        </FormLabel>

        <FormLabel label="Heart Rate (bpm)" error={fieldErrors.heartRate}>
          <div className="input flex mb-4 w-full">
            <input
              name="heartRate"
              type="number"
              defaultValue={state.inputs?.heartRate}
              required
            />
          </div>
        </FormLabel>

        <FormLabel
          label="Respiratory Rate (breaths/min)"
          error={fieldErrors.respiratoryRate}
        >
          <div className="input flex mb-4 w-full">
            <input
              name="respiratoryRate"
              type="number"
              defaultValue={state.inputs?.respiratoryRate}
              required
            />
          </div>
        </FormLabel>

        <FormLabel label="Weight (kg)" error={fieldErrors.weight}>
          <div className="input flex mb-4 w-full">
            <input
              name="weight"
              type="number"
              defaultValue={state.inputs?.weight}
              required
            />
          </div>
        </FormLabel>

        <FormLabel label="Height (cm)" error={fieldErrors.height}>
          <div className="input flex mb-4 w-full">
            <input
              name="height"
              type="number"
              defaultValue={state.inputs?.height}
              required
            />
          </div>
        </FormLabel>

        <FormLabel
          label="Waist Circumference (cm)"
          error={fieldErrors.waistCircumference}
        >
          <div className="input flex mb-4 w-full">
            <input
              name="waistCircumference"
              type="number"
              defaultValue={state.inputs?.waistCircumference}
              required
            />
          </div>
        </FormLabel>
      </div>

      <button className="btn btn-primary" type="submit">
        <FaSave size={19} />
        Save
      </button>
    </form>
  );
}
