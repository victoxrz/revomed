"use server";
import NavBar from "@/components/NavBar";
import { cookies } from "next/headers";

interface Patient {
  id: number;
  lastName: string;
  firstName: string;
  dateOfBirth: Date;
  gender: string;
  phone: string;
}

export default async function GetAllPatients() {
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
      console.log(response.statusText);
      return;
    }
    data = await response.json();

    // console.log(data[0].dateOfBirth);
  } catch (error) {
    console.error("Network error:", error);
  }

  return (
    <NavBar
      menu={
        <ul className="menu border-r border-slate-500 bg-white text-base-content min-h-full">
          <li>
            <a>Sidebar Item 1</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      }
    >
      {
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
      }
    </NavBar>
  );
}
