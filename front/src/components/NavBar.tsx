import Link from "next/link";
import { IoLogOutOutline } from "react-icons/io5";
import { TiUser } from "react-icons/ti";

// TODO: find out if its still important to close the navbar, if not clean up, also the layout don't forget
export default async function NavBar({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [isOpen, setIsOpen] = useState(true);

  // useEffect(() => {
  //   const mediaQuery = window.matchMedia("(min-width: 1024px)");
  //   setIsOpen(mediaQuery.matches);

  //   const handleResize = (e: MediaQueryListEvent) => {
  //     setIsOpen(e.matches);
  //   };

  //   mediaQuery.addEventListener("change", handleResize);
  //   return () => mediaQuery.removeEventListener("change", handleResize);
  // }, []);

  return (
    <div className="flex bg-base-300">
      <div
        className={`z-10 max-lg:visible invisible fixed inset-0 bg-black/30 transition-opacity duration-300 ${
          true ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        // onClick={() => setIsOpen(false)}
      ></div>
      <div
        className={`z-10 flex flex-col h-screen ${
          true ? "w-48" : "w-0"
        } overflow-hidden duration-300 max-lg:absolute relative bg-base-100 pr-2`}
      >
        {/* <div className="divider"></div> */}
        <ul className="menu font-semibold flex-grow w-full">
          <li className="flex-row">
            <Link href="/" className="text-xl">
              Revomed
            </Link>
            {/* <button className="btn btn-square">
                <FaBars size={19} />
              </button> */}
          </li>
          <li>
            <details open>
              <summary>Patient</summary>
              <ul>
                <li>
                  <Link href="/patients">Patient list</Link>
                </li>
                <li>
                  <Link href="/patients/create">Add pacient</Link>
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
            <a href="/profile">
              <TiUser size={19} />
              Profile
            </a>
          </li>
          <li>
            <a className="text-red-500" href="/account/logout">
              <IoLogOutOutline size={19} />
              Logout
            </a>
          </li>
        </ul>
      </div>

      <div className="p-6 w-full">{children}</div>
    </div>
  );
}
