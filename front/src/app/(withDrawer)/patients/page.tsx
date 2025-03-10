"use server";
import { cookies } from "next/headers";
import Link from "next/link";
import { PatientSum } from "./_types";
import { deletePatient } from "@/actions/PatientController";

export default async function Page() {
  let data: PatientSum[] = [];
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/patients/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          (await cookies()).get(process.env.AUTH_TOKEN_NAME!)?.value
        }`,
      },
    });
    if (!response.ok) {
      console.log(response.statusText, await response.text());
      return;
    }
    data = await response.json();
  } catch (error) {
    console.error("Network error:", error);
  }

  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>Nume</th>
          <th>Prenume</th>
          <th>Data nasterii</th>
          <th>Gen</th>
          <th>Telefon</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data.map((patient) => (
          <tr key={patient.id}>
            <td>{patient.lastName}</td>
            <td>{patient.firstName}</td>
            <td>{patient.birthday.toString()}</td>
            <td>{patient.gender}</td>
            <td>{patient.phone}</td>
            <td>
              <Link
                href={`patients/${patient.id}`}
                className="btn btn-primary mr-2"
              >
                Edit
              </Link>
              <form className="inline-block" action={deletePatient}>
                <input type="hidden" name="id" value={patient.id} />
                <button
                  className="btn btn-ghost text-red-500 font-bold"
                  type="submit"
                >
                  Delete
                </button>
              </form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
