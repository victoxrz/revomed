import { AppointmentForm } from '../_components/AppointmentForm';

export default function CreateAppointmentPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Appointment</h1>

      <div className="card card-border">
        <div className="card-body">
          <AppointmentForm />
        </div>
      </div>
    </div>
  );
}
