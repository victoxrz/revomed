"use client";
import { useActionState } from "react";
import { patientErrors, FormState, Patient } from "@/app/_lib/definitions";

export default function PatientForm({
  toExecute,
  patient,
}: {
  toExecute: (
    _state: FormState<patientErrors>,
    formData: FormData
  ) => Promise<{ errors?: patientErrors } | undefined>;
  patient: Patient | null;
}) {
  const [state, action] = useActionState(toExecute, undefined);
  const fieldErrors = state?.errors?.fieldErrors || {};
  return (
    <div className="flex justify-center items-center">
      <form className="w-96" action={action}>
        <input type="hidden" name="id" value={patient?.id} />
        <label className="form-control mb-4">
          <div className="label">
            <span className="label-text">Nume</span>
          </div>
          <div className="input input-bordered flex mb-4 w-full">
            <input
              name="lastName"
              type="text"
              className="grow w-full"
              placeholder="Nume"
              defaultValue={patient?.lastName}
            />
          </div>
          {fieldErrors.lastName && (
            <div className="text-sm">{fieldErrors.lastName}</div>
          )}
        </label>
        <label className="form-control mb-4">
          <div className="label">
            <span className="label-text">Prenume</span>
          </div>
          <div className="input input-bordered flex mb-4 w-full">
            <input
              name="firstName"
              type="text"
              className="grow"
              placeholder="Prenume"
              defaultValue={patient?.firstName}
            />
          </div>
          {fieldErrors.firstName && (
            <div className="text-sm">{fieldErrors.firstName}</div>
          )}
        </label>
        <label className="form-control mb-4">
          <div className="label">
            <span className="label-text">Patronimic</span>
          </div>
          <div className="input input-bordered flex mb-4 w-full">
            <input
              name="patronymic"
              type="text"
              className="grow"
              placeholder="Patronimic"
              defaultValue={patient?.patronymic}
            />
          </div>
        </label>
        <label className="form-control mb-4">
          <div className="label">
            <span className="label-text">Data nasterii</span>
          </div>
          <div className="input input-bordered flex mb-4 w-full">
            <input
              name="birthday"
              type="date"
              defaultValue={patient?.birthday.toString()}
            />
          </div>
          {fieldErrors.birthday && (
            <div className="text-sm">{fieldErrors.birthday}</div>
          )}
        </label>
        <label className="form-control mb-4">
          <div className="label">
            <span className="label-text">Gen</span>
          </div>
          <select
            className="select-bordered flex mb-4"
            name="gender"
            defaultValue={patient?.gender}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {fieldErrors.gender && (
            <div className="text-sm">{fieldErrors.gender}</div>
          )}
        </label>
        <label className="form-control mb-4">
          <div className="label">
            <span className="label-text">Grupa sangvina</span>
          </div>
          <select
            className="select-bordered flex mb-4"
            name="bloodType"
            defaultValue={patient?.bloodType}
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
          {fieldErrors.bloodType && (
            <div className="text-sm">{fieldErrors.bloodType}</div>
          )}
        </label>
        <label className="form-control mb-4">
          <div className="label">
            <span className="label-text">IDNP</span>
          </div>
          <div className="input input-bordered flex mb-4 w-full">
            <input
              name="idnp"
              type="text"
              className="grow"
              placeholder="IDNP"
              defaultValue={patient?.idnp}
            />
          </div>
          {fieldErrors.idnp && (
            <div className="text-sm">{fieldErrors.idnp}</div>
          )}
        </label>
        <label className="form-control mb-4">
          <div className="label">
            <span className="label-text">Numar de telefon</span>
          </div>
          <div className="input input-bordered flex mb-4 w-full">
            <input
              name="phone"
              type="text"
              className="grow"
              placeholder="Numar de telefon"
              defaultValue={patient?.phone}
            />
          </div>
          {fieldErrors.phone && (
            <div className="text-sm">{fieldErrors.phone}</div>
          )}
        </label>
        <label className="form-control mb-4">
          <div className="label">
            <span className="label-text">Job</span>
          </div>
          <div className="input input-bordered flex mb-4 w-full">
            <input
              name="job"
              type="text"
              className="grow"
              placeholder="Job"
              defaultValue={patient?.job}
            />
          </div>
          {fieldErrors.job && <div className="text-sm">{fieldErrors.job}</div>}
        </label>
        <label className="form-control mb-4">
          <div className="label">
            <span className="label-text">Adresa</span>
          </div>
          <div className="input input-bordered flex mb-4 w-full">
            <input
              name="streetAddress"
              type="text"
              className="grow"
              placeholder="Adresa"
              defaultValue={patient?.streetAddress}
            />
          </div>
          {fieldErrors.streetAddress && (
            <div className="text-sm">{fieldErrors.streetAddress}</div>
          )}
        </label>
        <label className="form-control mb-4">
          <div className="label">
            <span className="label-text">Tara</span>
          </div>
          <div className="input input-bordered flex mb-4 w-full">
            <input
              name="country"
              type="text"
              className="grow"
              placeholder="Tara"
              defaultValue={patient?.country}
            />
          </div>
        </label>
        <button className="btn btn-neutral block" type="submit">
          Salvare
        </button>
      </form>
    </div>
  );
}
