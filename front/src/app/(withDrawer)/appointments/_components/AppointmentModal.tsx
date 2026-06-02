"use client";
import { useActionState, useEffect } from "react";
import { updateAppointmentStatus } from "../appointments.actions";
import type { CalendarEvent, AppointmentStatus } from "../types";
import ErrorMessage from "@/components/ErrorMessage";

export function AppointmentModal({
  event,
  onClose,
  canEdit = false,
}: {
  event: CalendarEvent | null;
  onClose: () => void;
  canEdit?: boolean;
}) {
  canEdit &&= ["Pending", "Confirmed"].includes(event?.resource.status || "");

  const [updateState, updateAction, isUpdating] = useActionState(
    updateAppointmentStatus,
    null,
  );

  useEffect(() => {
    if (updateState?.success) {
      onClose();
    }
  }, [updateState?.success, onClose]);

  if (!event) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Appointment Details</h3>

        {updateState?.error && (
          <ErrorMessage message={updateState?.error || ""} />
        )}

        <div className="space-y-3">
          <div>
            <span className="font-semibold">Patient:</span>{" "}
            {event.resource.patientName}
          </div>
          <div>
            <span className="font-semibold">Medic:</span>{" "}
            {event.resource.medicName}
          </div>
          <div>
            <span className="font-semibold">Time:</span>{" "}
            {event.start.toLocaleString()} - {event.end.toLocaleTimeString()}
          </div>
          <div>
            <span className="font-semibold">Reason:</span>{" "}
            {event.resource.reason}
          </div>
          {event.resource.notes && (
            <div>
              <span className="font-semibold">Notes:</span>{" "}
              {event.resource.notes}
            </div>
          )}
          <div>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`badge ${getStatusBadgeColor(event.resource.status)}`}
            >
              {event.resource.status}
            </span>
          </div>
        </div>

        <div className="modal-action">
          {canEdit && (
            <form action={updateAction} className="space-x-2">
              <input
                type="hidden"
                name="appointmentId"
                value={event.resource.id}
              />

              <button
                type="submit"
                name="status"
                value={
                  event.resource.status === "Pending"
                    ? "Confirmed"
                    : "Completed"
                }
                className="btn btn-success"
                disabled={isUpdating}
              >
                {event.resource.status === "Pending"
                  ? "Confirm"
                  : "Mark Complete"}
              </button>

              <button
                type="submit"
                name="status"
                value="Cancelled"
                className="btn btn-error"
                disabled={isUpdating}
                onClick={(e) =>
                  !confirm("Cancel this appointment?") && e.preventDefault()
                }
              >
                Cancel Appointment
              </button>
            </form>
          )}

          <button className="btn" onClick={onClose} disabled={isUpdating}>
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}

function getStatusBadgeColor(status: AppointmentStatus): string {
  switch (status) {
    case "Pending":
      return "badge-warning";
    case "Confirmed":
      return "badge-success";
    case "Cancelled":
      return "badge-error";
    case "Completed":
      return "badge-neutral";
    default:
      return "";
  }
}
