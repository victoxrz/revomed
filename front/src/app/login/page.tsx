"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { IoKey, IoLogIn, IoLogInOutline, IoMail } from "react-icons/io5";

export default function Login() {
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-200 to-blue-200">
      <form>
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
                  type="text"
                  className="grow"
                  placeholder="Email"
                  required
                />
              </div>
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <div className="input input-bordered flex items-center gap-2">
                <IoKey size={19} />
                <input
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
            </label>
            <div className="card-actions justify-end">
              <button className="btn btn-neutral">
                <IoLogInOutline size={19}></IoLogInOutline>Login
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
