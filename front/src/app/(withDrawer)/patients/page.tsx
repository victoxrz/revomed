"use server";
import { cookies } from "next/headers";

interface Patient {
  id: number;
  lastName: string;
  firstName: string;
  dateOfBirth: Date;
  gender: string;
  phone: string;
}

export default async function Page() {
  let data: Patient[] = [];
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/patients/get`, {
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
    <table className="table-auto w-full">
      <thead>
        <tr>
          <th>Nume</th>
          <th>Prenume</th>
          <th>Data nasterii</th>
          <th>Gen</th>
          <th>Telefon</th>
        </tr>
      </thead>
      <tbody>
        {data.map((patient) => (
          <tr key={patient.id}>
            <td>{patient.lastName}</td>
            <td>{patient.firstName}</td>
            <td>{patient.dateOfBirth.toString()}</td>
            <td>{patient.gender}</td>
            <td>{patient.phone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
