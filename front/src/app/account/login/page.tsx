"use client";
import { useState, useActionState, useEffect } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { IoMail, IoKey } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import FormLabel from "@/components/FormLabel";
import { login } from "../actions";
import Card from "../_components/Card";
import { MdLogin } from "react-icons/md";
import Link from "next/link";

export default function LoginForm() {
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
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => setHidePassword(!hidePassword)}
            >
              {hidePassword ? <FaEyeSlash size={19} /> : <FaEye size={19} />}
            </button>
          </div>
        </FormLabel>
        <button className="btn btn-neutral mt-2" type="submit">
          <MdLogin size={19} />
          Login
        </button>
        <div className="divider text-gray-500 my-2">or</div>
        {/* <div>
          <div
            id="g_id_onload"
            // data-login_uri="https://your-site.example.com/auth/google/callback"
            data-client_id={process.env.GOOGLE_CLIENT_ID}
            data-auto_prompt="false"
          ></div>
          <div
            className="g_id_signin flex justify-center"
            data-type="standard"
            data-shape="rectangular"
            data-theme="outline"
            data-text="signin"
            data-size="large"
          ></div>
        </div> */}
        <div className="flex justify-center">
          <a href="/account/google/login" className="btn btn-outline w-full">
            <FcGoogle size={24} />
            Sign in with Google
          </a>
        </div>
        <div className="flex justify-center text-base-content">
          Don't have an account?
          <Link className="link link-primary ml-1" href="/account/signup">
            Sign up
          </Link>
        </div>
      </Card>
    </form>
  );
}
