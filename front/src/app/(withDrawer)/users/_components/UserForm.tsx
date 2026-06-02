"use client";
import { useActionState, useEffect } from "react";
import { FormState } from "@/lib/definitions";
import toast from "react-hot-toast";
import FormLabel from "@/components/FormLabel";
import { FaSave } from "react-icons/fa";
import { UserErrors, User } from "../types";

export function UserFormFields({
  user,
  fieldErrors,
  disabled = false,
}: {
  user: User | null;
  fieldErrors?: UserErrors["fieldErrors"];
  disabled?: boolean;
}) {
  return (
    <>
      <FormLabel label="Email" error={fieldErrors?.email}>
        <input
          name="email"
          type="email"
          className="input flex w-full"
          defaultValue={user?.email}
          disabled={disabled}
          required={!disabled}
        />
      </FormLabel>
      <FormLabel label="First name" error={fieldErrors?.firstName}>
        <input
          name="firstName"
          type="text"
          className="input flex w-full"
          defaultValue={user?.firstName}
          disabled={disabled}
          required={!disabled}
        />
      </FormLabel>
      <FormLabel label="Last name" error={fieldErrors?.lastName}>
        <input
          name="lastName"
          type="text"
          className="input flex w-full"
          defaultValue={user?.lastName}
          disabled={disabled}
          required={!disabled}
        />
      </FormLabel>
      <FormLabel label="Role" error={fieldErrors?.userRole}>
        <select
          className="select flex"
          name="userRole"
          defaultValue={user?.userRole}
          disabled={disabled}
          required={!disabled}
        >
          <option value="Admin">Admin</option>
          <option value="Medic">Medic</option>
          <option value="Assistant">Assistant</option>
          <option value="Patient">Patient</option>
          <option value="User">User</option>
        </select>
      </FormLabel>
    </>
  );
}

export default function UserForm({
  className,
  mutateAction,
  user,
}: {
  className?: string;
  mutateAction: (
    _state: FormState<UserErrors, User>,
    formData: FormData,
  ) => Promise<FormState<UserErrors, User>>;
  user: User | null;
}) {
  const [state, action] = useActionState(mutateAction, {
    inputs: user,
    message: "",
  });

  useEffect(() => {
    if (state.message) {
      if (state.isSuccessful) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  const fieldErrors = state.errors?.fieldErrors || {};

  return (
    <form className={className} action={action}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input type="hidden" name="id" value={user?.id} />
        <UserFormFields user={user} fieldErrors={fieldErrors} />
      </div>

      <button className="btn btn-primary" type="submit">
        <FaSave size={19} />
        Save
      </button>
    </form>
  );
}
