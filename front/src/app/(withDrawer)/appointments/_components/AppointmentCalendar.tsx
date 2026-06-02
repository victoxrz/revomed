"use client";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import type { AppointmentModel, CalendarEvent } from "../types";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export function AppointmentCalendar({
  appointments,
  onSelectEvent,
  onSelectSlot,
  selectable = false,
}: {
  appointments: AppointmentModel[];
  onSelectEvent?: (event: CalendarEvent) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
  selectable?: boolean;
}) {
  const events: CalendarEvent[] = appointments.map((apt) => ({
    id: apt.id,
    title: `${apt.patientName} - ${apt.reason}`,
    start: new Date(apt.startTime),
    end: new Date(apt.endTime),
    resource: {
      id: apt.id,
      patientId: apt.patientId,
      medicId: apt.medicId,
      status: apt.status,
      reason: apt.reason,
      notes: apt.notes,
      patientName: apt.patientName,
      medicName: apt.medicName,
    },
  }));

  const eventStyleGetter = (event: CalendarEvent) => {
    const colors: Record<string, { backgroundColor: string; color: string }> = {
      Pending: { backgroundColor: "#fbbf24", color: "#78350f" },
      Confirmed: { backgroundColor: "#10b981", color: "#064e3b" },
      Cancelled: { backgroundColor: "#ef4444", color: "#7f1d1d" },
      Completed: { backgroundColor: "#6b7280", color: "#1f2937" },
    };

    return {
      style: colors[event.resource.status] || {},
    };
  };

  return (
    <div className="h-[600px]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        selectable={selectable}
        eventPropGetter={eventStyleGetter}
        views={["month", "week", "day", "agenda"]}
        step={30}
        showMultiDayTimes
      />
    </div>
  );
}
