"use client";
import { useActionState } from "react";
import { create } from "../appointments.actions";
import ErrorMessage from "@/components/ErrorMessage";
import FormLabel from "@/components/FormLabel";
import { Appointment } from "../types";

export function AppointmentForm({
  appointment,
  onSuccess,
  onCancel,
}: {
  appointment: Appointment | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const [state, formAction, isPending] = useActionState(create, {
    inputs: appointment,
    message: "",
  });

  const defaultEndTime = new Date(appointment?.startTime || Date.now());
  defaultEndTime.setTime(defaultEndTime.getTime() + 30 * 60000);

  const fieldErrors = state?.errors?.fieldErrors || {};

  return (
    <form action={formAction} className="space-y-4">
      {state.message && !state.isSuccessful && (
        <ErrorMessage message={state.message} />
      )}

      <FormLabel label="Patient ID" error={fieldErrors.patientId}>
        <input
          type="text"
          name="patientId"
          className="input input-border w-full"
          defaultValue={state.inputs?.patientId}
          required
          placeholder="Enter patient ID"
          disabled={isPending}
        />
      </FormLabel>

      <FormLabel label="Medic ID" error={fieldErrors.medicId}>
        <input
          type="text"
          name="medicId"
          className="input input-border w-full"
          defaultValue={state.inputs?.medicId}
          required
          placeholder="Enter medic ID"
          disabled={isPending}
        />
      </FormLabel>

      <FormLabel label="Start Time" error={fieldErrors.startTime}>
        <input
          type="datetime-local"
          name="startTime"
          className="input input-border w-full"
          defaultValue={state.inputs?.startTime}
          required
          disabled={isPending}
        />
      </FormLabel>

      <FormLabel label="End Time" error={fieldErrors.endTime}>
        <input
          type="datetime-local"
          name="endTime"
          className="input input-border w-full"
          defaultValue={state.inputs?.endTime}
          required
          disabled={isPending}
        />
      </FormLabel>

      <FormLabel label="Reason" error={fieldErrors.reason}>
        <input
          type="text"
          name="reason"
          className="input input-border w-full"
          defaultValue={state.inputs?.reason}
          required
          placeholder="Reason for appointment"
          disabled={isPending}
        />
      </FormLabel>

      <FormLabel label="Notes" error={fieldErrors.notes}>
        <textarea
          name="notes"
          className="textarea textarea-border w-full"
          placeholder="Additional notes (optional)"
          rows={3}
          disabled={isPending}
        />
      </FormLabel>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost"
            disabled={isPending}
          >
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Create Appointment"
          )}
        </button>
      </div>
    </form>
  );
}
