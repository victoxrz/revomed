"use client";
import { createVisit } from "@/actions/VisitController";
import FormLabel from "@/components/FormLabel";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaSave } from "react-icons/fa";

export default function CreateVisitForm({
  titles,
  patientId,
}: {
  titles: string[];
  patientId: string;
}) {
  const [state, action] = useActionState(createVisit, {
    inputs: { fields: [], patientId: Number(patientId), templateId: 1 },
  });

  const fieldErrors = state?.errors?.fieldErrors || {};

  // TODO: find out if it rerenders or not
  useEffect(() => {
    if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form className="w-full max-w-2xl px-4" action={action}>
      <input type="hidden" name="patientId" value={patientId} />
      <input type="hidden" name="templateId" value={1} />

      {titles.map((element, index) => {
        return (
          <FormLabel key={element} label={element}>
            <textarea
              name={"fields"}
              className="textarea textarea-bordered grow flex mb-4 w-full"
              defaultValue={state?.inputs.fields[index]}
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
