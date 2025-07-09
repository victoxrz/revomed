"use client";
import FormLabel from "@/components/FormLabel";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaSave } from "react-icons/fa";
import { createVisit } from "./actions";
import { usePatientTabsContext } from "../PatientTabsProvider";

export default function CreateVisitForm({ className }: { className?: string }) {
  const ctx = usePatientTabsContext();

  const [state, action] = useActionState(createVisit, {
    inputs: null,
    message: "",
  });
  const fieldErrors = state?.errors?.fieldErrors || {};
  const inputs = state.inputs || {
    fields: [],
  };

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form
      className={`w-full mx-auto max-w-2xl p-6 ${className}`}
      action={action}
    >
      <input type="hidden" name="patientId" value={ctx.patient.id} />
      <input type="hidden" name="templateId" value={ctx.template.id} />

      {ctx.template.titles.map((element, index) => {
        return (
          <FormLabel key={element} label={element}>
            <textarea
              name="fields"
              className="textarea textarea-bordered grow flex mb-4 w-full"
              defaultValue={inputs.fields[index]}
              required
            />
          </FormLabel>
        );
      })}
      {fieldErrors && (
        <div className="text-sm text-red-500">{fieldErrors.fields}</div>
      )}
      <button type="submit" className="btn btn-primary">
        <FaSave size={19} />
        Save
      </button>
    </form>
  );
}
