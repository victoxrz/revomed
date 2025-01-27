"use client";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaBars } from "react-icons/fa6";

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
            <a className="btn btn-ghost text-xl">daisyUI</a>
          </div>
          <div className="flex-none">
            <button className="btn btn-square btn-ghost">
              <BsThreeDots size={19} />
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
