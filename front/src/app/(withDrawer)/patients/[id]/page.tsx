"use server";
import { cookies } from "next/headers";
import { useRouter } from "next/router";

interface Patient {
  email: string;
  Address: string;
  job: string;
  bloodType: string;
  id: number;
  lastName: string;
  firstName: string;
  dateOfBirth: Date;
  idnp: string;
  gender: string;
  phone: string;
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let patient: Patient | null = null;
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/patients/${(await params).id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${
            (await cookies()).get(process.env.AUTH_TOKEN_NAME!)?.value
          }`,
        },
      }
    );
    if (!response.ok) {
      console.log(response.statusText, await response.text());
      return;
    }
    patient = await response.json();
  } catch (error) {
    console.error("Network error:", error);
  }

  patient = {
    lastName: "Popescu",
    firstName: "Ion",
    dateOfBirth: new Date("1990-01-01"),
    id: 1,
    idnp: "1234567890123",
    gender: "Male",
    phone: "123-456-7890",
    email: "ion.popescu@example.com",
    job: "Engineer",
    bloodType: "O+",
    Address: "123 Main St, Anytown, Country",
  };

  if (!patient) {
    return <div className="p-4">Patient data could not be loaded.</div>;
  }

  return (
    <div className="flex justify-center items-center">
      <form className="w-96">
        <label className="form-control mb-4">
          <div className="label">
            <span className="label-text">Nume</span>
          </div>
          <div className="input input-bordered flex mb-4 w-full">
            <input
              name="last_name"
              type="text"
              className="grow w-full"
              placeholder="Nume"
              defaultValue={patient.lastName}
              required
            />
          </div>
        </label>
        <label className="form-control mb-4">
          <div className="label">
            <span className="label-text">Prenume</span>
          </div>
          <div className="input input-bordered flex mb-4 w-full">
            <input
              name="first_name"
              type="text"
              className="grow"
              placeholder="Prenume"
              defaultValue={patient.firstName}
              required
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
              defaultValue={patient.dateOfBirth.toISOString().split("T")[0]}
              required
            />
          </div>
        </label>
        <label className="form-control mb-4">
          <div className="label">
            <span className="label-text">Gen</span>
          </div>
          <select
            className="select-bordered flex mb-4"
            name="gender"
            defaultValue={patient.gender}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label className="form-control mb-4">
          <div className="label">
            <span className="label-text">Grupa sangvina</span>
          </div>
          <select
            className="select-bordered flex mb-4"
            name="bloodType"
            defaultValue={patient.bloodType}
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
              defaultValue={patient.idnp}
              required
            />
          </div>
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
              placeholder="IDNP"
              defaultValue={patient.phone}
              required
            />
          </div>
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
              defaultValue={patient.job}
              required
            />
          </div>
        </label>
        <label className="form-control mb-4">
          <div className="label">
            <span className="label-text">Adresa</span>
          </div>
          <div className="input input-bordered flex mb-4 w-full">
            <input
              name="address"
              type="text"
              className="grow"
              placeholder="Adresa"
              defaultValue={patient.Address}
              required
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
