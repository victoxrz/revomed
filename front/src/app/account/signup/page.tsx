"use client";
import { useState, useActionState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { IoMail, IoKey } from "react-icons/io5";
import Card from "../_components/Card";
import { signup } from "./actions";

export default function Signup() {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [state, action] = useActionState(signup, undefined);
  const fieldErrors = state?.errors?.fieldErrors || {};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-200 to-blue-200">
      <form action={action}>
        <Card title={"Sign up"}>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Email Address</span>
            </div>
            <div className="input input-bordered flex items-center gap-2">
              <IoMail size={19} />
              <input
                name="email"
                type="text"
                className="grow"
                placeholder="Email"
                required
              />
            </div>
            {fieldErrors.email && (
              <div className="text-sm">{fieldErrors.email}</div>
            )}
          </label>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Password</span>
            </div>
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
            {fieldErrors.password && (
              <div className="text-sm">
                <p>Password must:</p>
                <ul>
                  {fieldErrors.password.map((error) => (
                    <li key={error}>- {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </label>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Confirm Password</span>
            </div>
            <div className="input input-bordered flex items-center gap-2">
              <IoKey size={19} />
              <input
                name="confirmPassword"
                type={`${hideConfirmPassword ? "password" : "text"}`}
                className="grow"
                placeholder="Confirm Password"
                required
              />
              <div
                className="cursor-pointer"
                onClick={() => setHideConfirmPassword(!hideConfirmPassword)}
              >
                {hideConfirmPassword ? (
                  <FaEyeSlash size={19} />
                ) : (
                  <FaEye size={19} />
                )}
              </div>
            </div>
            {fieldErrors.confirmPassword && (
              <div className="text-sm">{fieldErrors.confirmPassword}</div>
            )}
          </label>
        </Card>
      </form>
    </div>
  );
}
