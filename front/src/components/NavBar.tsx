"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IoLogOutOutline } from "react-icons/io5";
import { TiUser } from "react-icons/ti";
import { PiSidebarSimple } from "react-icons/pi";

// TODO: find out if its still important to close the navbar, if not clean up, also the layout don't forget
export default function NavBar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(typeof window !== "undefined" && window.innerWidth >= 1024);
  }, []);

  return (
    <div className="bg-base-200 flex">
      <div
        className={`z-10 max-lg:visible invisible fixed inset-0 bg-black/30 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>
      <div
        className={`z-10 flex flex-col fixed h-screen w-48 pr-2 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-hidden duration-300 bg-base-100`}
      >
        <ul className="menu font-semibold flex-grow w-full">
          <li className="flex-row">
            <Link href="/" className="text-xl">
              Revomed
            </Link>
          </li>
          <li>
            <details open>
              <summary>Patient</summary>
              <ul>
                <li>
                  <Link
                    href="/patients"
                    className={pathname === "/patients" ? "menu-active" : ""}
                  >
                    Patient list
                  </Link>
                </li>
                <li>
                  <Link
                    href="/patients/create"
                    className={
                      pathname === "/patients/create" ? "menu-active" : ""
                    }
                  >
                    Add pacient
                  </Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details>
              <summary>Medic</summary>
              <ul>
                <li>
                  <a>Medic list</a>
                </li>
                <li>
                  <a>Add medic</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
        <ul className="menu w-full font-semibold">
          <li>
            <Link
              href="/profile"
              className={pathname === "/profile" ? "menu-active" : ""}
            >
              <TiUser size={19} />
              Profile
            </Link>
          </li>
          <li>
            <a className="text-red-500" href="/account/logout">
              <IoLogOutOutline size={19} />
              Logout
            </a>
          </li>
        </ul>
      </div>
      <div
        className={`
          flex-1 flex flex-col min-h-screen min-w-0
          transition-margin duration-300
          ${isOpen ? "ml-48" : "ml-0"}
        `}
      >
        <div className="pl-6 pt-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-sm btn-square btn-ghost"
          >
            <PiSidebarSimple size={19} />
          </button>
        </div>
        <div className="pt-2 p-6 w-full flex-1 overflow-x-auto">
          <div className="min-w-full w-fit">{children}</div>
        </div>
      </div>
    </div>
  );
}
