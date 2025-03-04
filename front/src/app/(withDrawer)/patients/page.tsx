"use server";
import { cookies } from "next/headers";
import Link from "next/link";

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

  data = [
    {
      id: 1,
      lastName: "Popescu",
      firstName: "Ion",
      dateOfBirth: new Date("1990-01-01"),
      gender: "M",
      phone: "0722222222",
    },
  ];

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
            <td>{patient.dateOfBirth.toString()}</td>
            <td>{patient.gender}</td>
            <td>{patient.phone}</td>
            <td>
              <Link href={`patients/${patient.id}`} className="btn btn-primary">
                Edit
              </Link>
              {/* <button className="btn btn-danger">Delete</button> */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
