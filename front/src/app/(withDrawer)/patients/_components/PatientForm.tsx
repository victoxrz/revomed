"use client";
import { useActionState, useEffect } from "react";
import { FormState } from "@/lib/definitions";
import toast from "react-hot-toast";
import FormLabel from "@/components/FormLabel";
import { FaSave } from "react-icons/fa";
import { patientErrors, Patient } from "../types";

export default function PatientForm({
  className,
  toExecute,
  patient,
}: {
  className?: string;
  toExecute: (
    _state: FormState<patientErrors, Patient>,
    formData: FormData
  ) => Promise<FormState<patientErrors, Patient>>;
  patient: Patient | null;
}) {
  const [state, action] = useActionState(toExecute, {
    inputs: patient,
    message: "",
  });

  useEffect(() => {
    if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  const fieldErrors = state.errors?.fieldErrors || {};

  return (
    <form
      className={`w-full mx-auto max-w-2xl p-6 ${className}`}
      action={action}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="hidden" name="id" value={patient?.id} />
        <FormLabel label="Last name" error={fieldErrors.lastName}>
          <div className="input flex mb-4 w-full">
            <input
              name="lastName"
              type="text"
              defaultValue={state.inputs?.lastName}
              required
            />
          </div>
        </FormLabel>

        <FormLabel label="First name" error={fieldErrors.firstName}>
          <div className="input flex mb-4 w-full">
            <input
              name="firstName"
              type="text"
              defaultValue={state.inputs?.firstName}
              required
            />
          </div>
        </FormLabel>

        <FormLabel label="Patronymic" error={fieldErrors.patronymic}>
          <div className="input flex mb-4 w-full">
            <input
              name="patronymic"
              type="text"
              defaultValue={state.inputs?.patronymic}
            />
          </div>
        </FormLabel>

        <FormLabel label="Birthday" error={fieldErrors.birthday}>
          <input
            name="birthday"
            type="date"
            className="input flex mb-4 w-full"
            defaultValue={state.inputs?.birthday.toString()}
            required
          />
        </FormLabel>

        <FormLabel label="Gender" error={fieldErrors.gender}>
          <select
            className="select flex mb-4"
            name="gender"
            defaultValue={state.inputs?.gender}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </FormLabel>

        <FormLabel label="Blood type" error={fieldErrors.bloodType}>
          <select
            className="select flex mb-4"
            name="bloodType"
            defaultValue={state.inputs?.bloodType}
            required
          >
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </FormLabel>

        <FormLabel label="IDNP" error={fieldErrors.idnp}>
          <div className="input flex mb-4 w-full">
            <input
              name="idnp"
              type="text"
              defaultValue={state.inputs?.idnp}
              required
            />
          </div>
        </FormLabel>

        <FormLabel label="Phone number" error={fieldErrors.phone}>
          <div className="input flex mb-4 w-full">
            <input
              name="phone"
              type="text"
              defaultValue={state.inputs?.phone}
              required
            />
          </div>
        </FormLabel>

        <FormLabel label="Job" error={fieldErrors.job}>
          <div className="input flex mb-4 w-full">
            <input
              name="job"
              type="text"
              defaultValue={state.inputs?.job}
              required
            />
          </div>
        </FormLabel>

        <FormLabel label="Street address" error={fieldErrors.streetAddress}>
          <div className="input flex mb-4 w-full">
            <input
              name="streetAddress"
              type="text"
              defaultValue={state.inputs?.streetAddress}
              required
            />
          </div>
        </FormLabel>

        <FormLabel label="Country" error={fieldErrors.country}>
          <div className="input flex mb-4 w-full">
            <input
              name="country"
              type="text"
              defaultValue={state.inputs?.country}
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
