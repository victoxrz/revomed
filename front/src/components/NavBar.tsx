"use client";
import Link from "next/link";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaBars } from "react-icons/fa6";
import { IoLogOutOutline } from "react-icons/io5";

/* 
on large screens default to open
*/
export default function NavBar({
  menu,
  children,
}: {
  menu: React.ReactNode;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex">
      <div
        className={`z-10 max-lg:visible invisible fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>
      <div
        className={`z-10 h-screen ${
          isOpen ? "w-72" : "w-0"
        } overflow-hidden duration-300 max-lg:absolute relative text-white`}
      >
        {menu}
      </div>
      <div className="flex flex-col w-full">
        <div className="navbar bg-base-100">
          <div className="flex-none">
            <button
              className="btn btn-square btn-ghost"
              onClick={() => setIsOpen(!isOpen)}
            >
              <FaBars size={19} />
            </button>
          </div>
          <div className="flex-1">
            <a className="btn btn-ghost text-xl">Revomed</a>
          </div>
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-square btn-ghost"
              >
                <BsThreeDots size={19} />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li>
                  <a className="text-red-500 font-bold" href="/account/logout">
                    <IoLogOutOutline size={19} />
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
