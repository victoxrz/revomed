import { IoLogInOutline } from "react-icons/io5";

export default function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card glass w-96">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {children}
        <div className="card-actions justify-end">
          <button className="btn btn-neutral" type="submit">
            <IoLogInOutline size={19}></IoLogInOutline>
            {title}
          </button>
        </div>
      </div>
    </div>
  );
}
