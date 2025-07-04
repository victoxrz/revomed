"use client";
import { useState, useActionState, useEffect } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { IoMail, IoKey } from "react-icons/io5";
import toast from "react-hot-toast";
import FormLabel from "@/components/FormLabel";
import { login } from "../actions";
import Card from "../_components/Card";

export default function Page() {
  const [hidePassword, setHidePassword] = useState(true);
  const [state, action] = useActionState(login, {
    inputs: null,
    message: "",
  });
  const fieldErrors = state.errors?.fieldErrors || {};

  useEffect(() => {
    if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-r from-cyan-200 to-blue-200">
      <form action={action}>
        <Card title={"Login"}>
          <FormLabel label="Email Address" error={fieldErrors.email}>
            <div className="input input-bordered flex items-center gap-2">
              <IoMail size={19} />
              <input
                name="email"
                type="text"
                className="grow"
                placeholder="Email"
                defaultValue={state.inputs?.email}
                required
              />
            </div>
          </FormLabel>
          <FormLabel
            className="mb-2"
            label="Password"
            error={fieldErrors.password}
          >
            <div className="input input-bordered flex items-center gap-2">
              <IoKey size={19} />
              <input
                name="password"
                type={`${hidePassword ? "password" : "text"}`}
                className="grow"
                placeholder="Password"
                required
              />
              <div
                className="cursor-pointer"
                onClick={() => setHidePassword(!hidePassword)}
              >
                {hidePassword ? <FaEyeSlash size={19} /> : <FaEye size={19} />}
              </div>
            </div>
          </FormLabel>
        </Card>
      </form>
    </div>
  );
}
