"use client";
import { useState } from "react";
import moment from "moment";
import { AppointmentCalendar } from "./AppointmentCalendar";
import { AppointmentModal } from "./AppointmentModal";
import { AppointmentForm } from "./AppointmentForm";
import type { AppointmentModel, CalendarEvent } from "../types";

export function AppointmentCalendarView({
  appointments,
}: {
  appointments: AppointmentModel[];
}) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAppointmentSlot, setNewAppointmentSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setNewAppointmentSlot(slotInfo);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setNewAppointmentSlot(null);
  };

  return (
    <>
      <AppointmentCalendar
        appointments={appointments}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
      />

      <AppointmentModal
        event={selectedEvent}
        onClose={handleCloseModal}
        canEdit
      />

      {showCreateModal && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create New Appointment</h3>
            <AppointmentForm
              appointment={{
                id: "",
                patientId: "",
                medicId: "",
                startTime: moment(newAppointmentSlot?.start).format("YYYY-MM-DDTHH:mm"),
                endTime: moment(newAppointmentSlot?.end).format("YYYY-MM-DDTHH:mm"),
                status: "Pending",
                reason: "",
              }}
              onSuccess={handleCloseCreateModal}
              onCancel={handleCloseCreateModal}
            />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={handleCloseCreateModal}>close</button>
          </form>
        </dialog>
      )}
    </>
  );
}
