"use client";
import { useActionState, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { IoKey, IoLogInOutline, IoMail } from "react-icons/io5";
import { login } from "../actions/auth";

export default function Login() {
  const [hidePassword, setHidePassword] = useState(true);
  const [state, action] = useActionState(login, undefined);
  const fieldErrors = state?.errors?.fieldErrors || {};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-200 to-blue-200">
      <form action={action}>
        <div className="card glass w-96">
          <div className="card-body">
            <h2 className="card-title">Login</h2>
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
                  {hidePassword ? (
                    <FaEyeSlash size={19} />
                  ) : (
                    <FaEye size={19} />
                  )}
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
            <div className="card-actions justify-end">
              <button className="btn btn-neutral" type="submit">
                <IoLogInOutline size={19}></IoLogInOutline>Login
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
