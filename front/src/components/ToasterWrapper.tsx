"use client";
import toast, { resolveValue, Toast, Toaster } from "react-hot-toast";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export default function ToasterWrapper() {
  return (
    <Toaster>
      {(t: Toast) => {
        let alertClassName: string = "";
        switch (t.type) {
          case "success":
            alertClassName = "alert-success";
            break;
          case "error":
            alertClassName = "alert-error";
            break;
          default:
            alertClassName = "alert-info";
            break;
        }
        return (
          <div
            role="alert"
            className={`alert ${alertClassName} flex transition-all duration-300 ${
              t.visible ? "opacity-100" : "opacity-0"
            }`}
          >
            <AiOutlineExclamationCircle color="white" size={21} />
            <span className="flex-grow">{resolveValue(t.message, t)}</span>
            <button
              className="btn btn-ghost border-0 btn-sm text-white hover:bg-white hover:text-error"
              onClick={() => toast.dismiss(t.id)}
            >
              ✕
            </button>
          </div>
        );
      }}
    </Toaster>
  );
}
