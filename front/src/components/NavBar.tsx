"use client";
import Link, { LinkProps } from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IoLogOutOutline } from "react-icons/io5";
import { TiUser } from "react-icons/ti";
import { PiSidebarSimple } from "react-icons/pi";
import { RouteType } from "next/dist/lib/load-custom-routes";
import { UserRole } from "@/app/(withDrawer)/users/types";
import { ROUTES_ROLES } from "@/lib/dal/types";

const SIDEBAR_STORAGE_KEY = "sidebarOpen";

interface MenuLink {
  href: LinkProps<RouteType>["href"];
  label: string;
  allowedRoles: UserRole[];
}

interface MenuItem {
  label: string;
  links: MenuLink[];
}

// TODO: it drives me crazy the sidebar opening when refreshing the page
export default function NavBar({
  children,
  userRole,
}: {
  children: React.ReactNode;
  userRole: UserRole;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menu: MenuItem[] = [
    {
      label: "Patients",
      links: [
        {
          href: "/patients",
          label: "Patient list",
          allowedRoles: ROUTES_ROLES.PATIENTS.LIST,
        },
        {
          href: "/patients/create",
          label: "Add pacient",
          allowedRoles: ROUTES_ROLES.PATIENTS.CREATE,
        },
      ],
    },
    {
      label: "Users",
      links: [
        {
          href: "/users",
          label: "User list",
          allowedRoles: ROUTES_ROLES.USERS.LIST,
        },
      ],
    },
    {
      label: "Visit Templates",
      links: [
        {
          href: "/templates",
          label: "Template list",
          allowedRoles: ROUTES_ROLES.TEMPLATES.LIST,
        },
        {
          href: "/templates/create",
          label: "Create template",
          allowedRoles: ROUTES_ROLES.TEMPLATES.CREATE,
        },
      ],
    },
    {
      label: "Your information",
      links: [
        {
          href: "/visits/me",
          label: "Your visits",
          allowedRoles: ROUTES_ROLES.VISITS.ME,
        },
      ],
    },
  ];

  useEffect(() => {
    const storedIsOpen = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    // if null, default to open
    setIsOpen((storedIsOpen ?? "true") === "true");

    // Open details if it contains active link
    document.querySelectorAll("details").forEach((details) => {
      if (details.querySelector(".menu-active")) {
        details.open = true;
      }
    });
  }, [pathname]);

  const toogleSidebar = (newValue: boolean) => {
    setIsOpen(newValue);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(newValue));
  };

  return (
    <div className="bg-base-200 flex">
      <div
        className={`z-10 max-lg:visible invisible fixed inset-0 bg-black/30 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => toogleSidebar(false)}
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
          {menu
            .filter((menuItem) =>
              menuItem.links.some((link) =>
                link.allowedRoles.includes(userRole),
              ),
            )
            .map((menuItem) => (
              <li key={menuItem.label}>
                <details>
                  <summary>{menuItem.label}</summary>
                  <ul>
                    {menuItem.links
                      .filter((link) => link.allowedRoles.includes(userRole))
                      .map((link, index) => (
                        <li key={index}>
                          <Link
                            href={link.href}
                            className={
                              pathname === link.href ? "menu-active" : ""
                            }
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </details>
              </li>
            ))}
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
            onClick={() => toogleSidebar(!isOpen)}
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
