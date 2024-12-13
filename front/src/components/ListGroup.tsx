export default function ListGroup() {
  const items = ["New York", "San Francisco", "Tokyo", "London", "Paris"];
  return (
    <>
      <h1>List Group</h1>
      <div className="relative flex flex-col rounded-lg shadow-sm border border-slate-200">
        <nav className="flex min-w-[240px] flex-col gap-1 p-1.5">
          {items.map((item) => (
            <div
              key={item}
              role="button"
              className="text-white flex w-full items-center rounded-md p-3 transition-all hover:text-black hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
            >
              {item}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
