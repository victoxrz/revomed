import NavBar from "@/components/NavBar";
import Link from "next/link";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NavBar
      menu={
        <ul className="menu min-h-full font-semibold">
          <li>
            <Link href="/patients">Patients</Link>
            <ul>
              <li>
                <Link href="/patients/create">Add pacient</Link>
              </li>
            </ul>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      }
    >
      {children}
    </NavBar>
  );
}
