import NavBar from "@/components/NavBar";

export default function GetAllPatients() {
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
      children={<h1 className="text-xl font-bold">asdasdasd</h1>}
    ></NavBar>
  );
}
