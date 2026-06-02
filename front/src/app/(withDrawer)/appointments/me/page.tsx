import { Suspense } from 'react';
import { getMyAppointments } from '../appointments.actions';
import type { AppointmentStatus } from '../types';

export default async function MyAppointmentsPage() {
  const appointments = await getMyAppointments();

  const groupedAppointments = {
    upcoming: appointments.filter(
      (apt) =>
        (apt.status === 'Pending' || apt.status === 'Confirmed') && new Date(apt.startTime) > new Date()
    ),
    past: appointments.filter(
      (apt) =>
        apt.status === 'Completed' ||
        apt.status === 'Cancelled' ||
        (apt.status !== 'Completed' && apt.status !== 'Cancelled' && new Date(apt.startTime) < new Date())
    ),
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <a href="/appointments" className="btn btn-ghost">
          View Calendar
        </a>
      </div>

      <Suspense fallback={<div className="loading loading-spinner loading-lg"></div>}>
        {/* Upcoming Appointments */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Upcoming</h2>
          {groupedAppointments.upcoming.length === 0 ? (
            <div className="alert">No upcoming appointments</div>
          ) : (
            <div className="space-y-4">
              {groupedAppointments.upcoming.map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))}
            </div>
          )}
        </div>

        {/* Past Appointments */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Past</h2>
          {groupedAppointments.past.length === 0 ? (
            <div className="alert">No past appointments</div>
          ) : (
            <div className="space-y-4">
              {groupedAppointments.past.map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))}
            </div>
          )}
        </div>
      </Suspense>
    </div>
  );
}

function AppointmentCard({ appointment }: { appointment: any }) {
  const startDate = new Date(appointment.startTime);
  const endDate = new Date(appointment.endTime);

  return (
    <div className="card card-border">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="card-title">{appointment.reason}</h3>
              <StatusBadge status={appointment.status} />
            </div>
            <p className="text-sm">
              <span className="font-semibold">Patient:</span> {appointment.patientName}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Medic:</span> {appointment.medicName}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Time:</span> {startDate.toLocaleString()} -{' '}
              {endDate.toLocaleTimeString()}
            </p>
            {appointment.notes && (
              <p className="text-sm">
                <span className="font-semibold">Notes:</span> {appointment.notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const colors: Record<AppointmentStatus, string> = {
    Pending: 'badge-warning',
    Confirmed: 'badge-success',
    Cancelled: 'badge-error',
    Completed: 'badge-neutral',
  };

  return <span className={`badge ${colors[status]}`}>{status}</span>;
}
