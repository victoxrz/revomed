"use client";
import { useActionState, useEffect } from "react";
import { FormState } from "@/lib/definitions";
import toast from "react-hot-toast";
import FormLabel from "@/components/FormLabel";
import { FaSave } from "react-icons/fa";
import { patientErrors, Patient } from "../types";
import { IoMdInformationCircle } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/actions";

export default function PatientForm({
  className,
  mutateAction,
  patient,
}: {
  className?: string;
  mutateAction: (
    _state: FormState<patientErrors, Patient>,
    formData: FormData
  ) => Promise<FormState<patientErrors, Patient>>;
  patient: Patient | null;
}) {
  const [state, action] = useActionState(mutateAction, {
    inputs: patient,
    message: "",
  });

  useEffect(() => {
    if (state.message) {
      if (state.isSuccesful) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  const fieldErrors = state.errors?.fieldErrors || {};

  return (
    <form className={className} action={action}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input type="hidden" name="id" value={patient?.id} />
        <FormLabel label="Last name" error={fieldErrors.lastName}>
          <input
            name="lastName"
            type="text"
            className="input flex w-full"
            defaultValue={state.inputs?.lastName}
            required
          />
        </FormLabel>

        <FormLabel label="First name" error={fieldErrors.firstName}>
          <input
            name="firstName"
            type="text"
            className="input flex w-full"
            defaultValue={state.inputs?.firstName}
            required
          />
        </FormLabel>

        <FormLabel label="Patronymic" error={fieldErrors.patronymic}>
          <input
            name="patronymic"
            type="text"
            className="input flex w-full"
            defaultValue={state.inputs?.patronymic}
          />
        </FormLabel>

        <FormLabel label="Birthday" error={fieldErrors.birthday}>
          <input
            name="birthday"
            type="date"
            className="input flex w-full"
            defaultValue={state.inputs?.birthday.toString()}
            required
          />
        </FormLabel>

        <FormLabel label="Gender" error={fieldErrors.gender}>
          <select
            className="select flex"
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
            className="select flex"
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
          <input
            name="idnp"
            type="text"
            className="input flex w-full"
            defaultValue={state.inputs?.idnp}
            required
          />
        </FormLabel>

        <FormLabel label="Phone number" error={fieldErrors.phone}>
          <input
            name="phone"
            type="text"
            className="input flex w-full"
            defaultValue={state.inputs?.phone}
            required
          />
        </FormLabel>

        <FormLabel label="Job" error={fieldErrors.job}>
          <input
            name="job"
            type="text"
            className="input flex w-full"
            defaultValue={state.inputs?.job}
            required
          />
        </FormLabel>

        <FormLabel label="Insurance policy" error={fieldErrors.insurancePolicy}>
          <input
            name="insurancePolicy"
            type="text"
            className="input flex mb-1 w-full"
            defaultValue={state.inputs?.insurancePolicy}
            required
          />
          <div className="flex items-center">
            <div
              className={`badge badge-soft px-2 gap-1 ${
                patient?.isInsured === null
                  ? "badge-info"
                  : patient?.isInsured
                  ? "badge-success"
                  : "badge-error"
              }`}
            >
              <IoMdInformationCircle
                size={19}
                title="Information provided by cnam.gov.md"
              />
              {patient?.isInsured === null
                ? "necunoscut"
                : patient?.isInsured
                ? "asigurat"
                : "neasigurat"}
            </div>
          </div>
        </FormLabel>

        <FormLabel label="Street address" error={fieldErrors.streetAddress}>
          <input
            name="streetAddress"
            type="text"
            className="input flex w-full"
            defaultValue={state.inputs?.streetAddress}
            required
          />
        </FormLabel>

        <FormLabel label="Country" error={fieldErrors.country}>
          <input
            name="country"
            type="text"
            className="input flex w-full"
            defaultValue={state.inputs?.country}
            required
          />
        </FormLabel>
      </div>

      <button className="btn btn-primary" type="submit">
        <FaSave size={19} />
        Save
      </button>
    </form>
  );
}
