import { BsThreeDots } from "react-icons/bs";
import { Patient } from "../types";
import Link from "next/link";

export default function PatientOptions({ patient }: { patient: Patient }) {
  return (
    <>
      <button
        className="btn btn-ghost"
        popoverTarget="popover-1"
        style={{ anchorName: "--anchor-1" } as React.CSSProperties}
      >
        <BsThreeDots></BsThreeDots>
      </button>
      <ul
        className="dropdown dropdown-end menu rounded-box bg-base-100 shadow-sm"
        popover="auto"
        id="popover-1"
        style={{ positionAnchor: "--anchor-1" } as React.CSSProperties}
      >
        <li>
          <form
            action="/docs/data-protection"
            method="POST"
            target="_blank"
            rel="noopener noreferrer"
          >
            <input type="hidden" name="firstName" value={patient.firstName} />
            <input type="hidden" name="lastName" value={patient.lastName} />
            <input type="hidden" name="phone" value={patient.phone} />
            <input type="hidden" name="patronymic" value={patient.patronymic} />
            <input
              type="hidden"
              name="streetAddress"
              value={patient.streetAddress}
            />
            <input type="hidden" name="idnp" value={patient.idnp} />
            <input type="hidden" name="country" value={patient.country} />

            <button type="submit" className="cursor-pointer">
              Data Protection Policy
            </button>
          </form>
        </li>
        <li>
          <Link
            target="_blank"
            href={{
              pathname: "/docs/medical-report",
              query: { patientId: patient.id },
            }}
          >
            Generate report
          </Link>
        </li>
      </ul>
    </>
  );
}
