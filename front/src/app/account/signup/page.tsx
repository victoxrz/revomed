"use client";
import { useState, useActionState, useEffect } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { IoMail, IoKey } from "react-icons/io5";
import toast from "react-hot-toast";
import FormLabel from "@/components/FormLabel";
import { signup } from "../actions";
import Card from "../_components/Card";
import { MdLogin } from "react-icons/md";

export default function SignupForm() {
  const [hidePassword, setHidePassword] = useState(true);
  // const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [state, action] = useActionState(signup, {
    inputs: null,
    message: "",
  });
  const fieldErrors = state?.errors?.fieldErrors || {};

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={action}>
      <Card title="Sign up">
        <FormLabel label="Email Address" error={fieldErrors.email}>
          <div className="input flex items-center gap-2">
            <IoMail size={19} />
            <input
              name="email"
              type="text"
              className="grow"
              placeholder="Email"
              defaultValue={state?.inputs?.email}
              required
            />
          </div>
        </FormLabel>
        <FormLabel label="Password" error={fieldErrors.password}>
          <div className="input flex items-center gap-2">
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
        <FormLabel label="Confirm password" error={fieldErrors.confirmPassword}>
          <div className="input flex items-center gap-2">
            <IoKey size={19} />
            <input
              name="confirmPassword"
              type={`${hidePassword ? "password" : "text"}`}
              className="grow"
              placeholder="Confirm Password"
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
          Sign up
        </button>
        <div className="divider text-gray-500 my-2">or</div>
        <div>
          <div
            id="g_id_onload"
            // data-login_uri="https://your-site.example.com/auth/google/callback"
            data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
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
        </div>
      </Card>
    </form>
  );
}
