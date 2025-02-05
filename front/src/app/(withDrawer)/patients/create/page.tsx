"use client";
import { create } from "./actions";
import { useActionState } from "react";

export default function Page() {
  const [state, action] = useActionState(create, undefined);
  const fieldErrors = state?.errors?.fieldErrors || {};

  return (
    <form action={action}>
      <label className="form-control">
        <div className="label">
          <span className="label-text">Nume</span>
        </div>
        <div className="input input-bordered flex items-center gap-2">
          <input
            name="last_name"
            type="text"
            className="grow"
            placeholder="Nume"
            required
          />
        </div>
        {fieldErrors.last_name && (
          <div className="text-sm">{fieldErrors.last_name}</div>
        )}
      </label>
      <label className="form-control">
        <div className="label">
          <span className="label-text">Prenume</span>
        </div>
        <div className="input input-bordered flex items-center gap-2">
          <input
            name="first_name"
            type="text"
            className="grow"
            placeholder="Prenume"
            required
          />
        </div>
        {fieldErrors.first_name && (
          <div className="text-sm">{fieldErrors.first_name}</div>
        )}
      </label>
      <label className="form-control">
        <div className="label">
          <span className="label-text">Data nasterii</span>
        </div>
        <div className="input input-bordered flex items-center gap-2">
          <input name="birthday" type="date" required />
        </div>
        {fieldErrors.birthday && (
          <div className="text-sm">{fieldErrors.birthday}</div>
        )}
      </label>
      <label className="form-control">
        <div className="label">
          <span className="label-text">Gen</span>
        </div>
        <select className=" select-bordered" name="gender" required>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        {fieldErrors.gender && (
          <div className="text-sm">{fieldErrors.gender}</div>
        )}
      </label>
      <button className="btn btn-neutral" type="submit">
        Submit
      </button>
    </form>
  );
}
