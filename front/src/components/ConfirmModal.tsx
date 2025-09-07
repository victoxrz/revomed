"use client";
import { useActionState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function ConfirmModal({
  mutateAction,
  id,
  children,
  openButton,
  closeButton,
  submitButton,
}: {
  mutateAction: (
    state: { message: string } | undefined,
    formData: FormData
  ) => Promise<{ message: string }>;
  id: number;
  children: React.ReactNode;
  openButton: string;
  closeButton: string;
  submitButton: string;
}) {
  const dialogRef = useRef<null | HTMLDialogElement>(null);
  const [state, action] = useActionState(mutateAction, undefined);

  //TODO: dialog goes on top the toast, makes it less visible
  useEffect(() => {
    if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <>
      <button
        className="btn text-white btn-error"
        onClick={() => dialogRef.current?.showModal()}
      >
        {openButton}
      </button>
      <dialog className="modal" ref={dialogRef}>
        <div className="modal-box">
          {children}
          <div className="modal-action">
            <button className="btn" onClick={() => dialogRef.current?.close()}>
              {closeButton}
            </button>
            <form action={action}>
              <input type="hidden" name="id" value={id} />
              <button type="submit" className="btn btn-error text-white">
                {submitButton}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
