import { Suspense } from "react";
import { getAllAppointments } from "./appointments.actions";
import { AppointmentCalendarView } from "./_components/AppointmentCalendarView";

export default async function AppointmentsPage() {
  const appointments = await getAllAppointments();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Appointments Calendar</h1>

      <div className="card card-border">
        <div className="card-body">
          <Suspense
            fallback={
              <div className="loading loading-spinner loading-lg"></div>
            }
          >
            <AppointmentCalendarView appointments={appointments} />
          </Suspense>
        </div>
      </div>

      <div className="mt-4 flex gap-4">
        <div className="flex items-center gap-2">
          <span className="badge badge-warning"></span>
          <span className="text-sm">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-success"></span>
          <span className="text-sm">Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-neutral"></span>
          <span className="text-sm">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-error"></span>
          <span className="text-sm">Cancelled</span>
        </div>
      </div>
    </div>
  );
}
