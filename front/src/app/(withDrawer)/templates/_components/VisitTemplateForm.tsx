"use client";
import FormLabel from "@/components/FormLabel";
import { FaPlus, FaSave } from "react-icons/fa";
import { VisitTemplate, VisitTemplateErrors } from "../types";
import { FormState } from "@/lib/definitions";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionView, TitleItem, useTree } from "@/components/useTree";

export default function VisitTemplateForm({
  mutateAction,
  template,
}: {
  mutateAction: (
    _state: FormState<VisitTemplateErrors, VisitTemplate>,
    formData: FormData
  ) => Promise<FormState<VisitTemplateErrors, VisitTemplate>>;
  template: VisitTemplate | null;
}) {
  const [state, action] = useActionState(mutateAction, {
    inputs: template,
    message: "",
  });

  const {
    tree: titles,
    addItem,
    removeItem,
  } = useTree(
    () =>
      template?.titles.map(
        (t, parentIdx, arr): TitleItem => ({
          id: parentIdx.toString(),
          content: t[0],
          subtitles: t.slice(1).map(
            (s, i): TitleItem => ({
              id: `${parentIdx}-${i}`,
              content: arr[parentIdx][i + 1],
            })
          ),
        })
      ) ?? []
  );

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
    <form className={`w-full mx-auto max-w-2xl p-6`} action={action}>
      <input name="id" type="hidden" value={template?.id} />
      <FormLabel
        label="Template name"
        error={fieldErrors.name}
        className="block w-max mx-auto"
      >
        <input
          type="text"
          className="input input-bordered"
          name="name"
          defaultValue={state.inputs?.name}
          required
        />
      </FormLabel>

      <FormLabel label="Require triage?" className="flex flex-col">
        <input
          name="requireTriage"
          type="checkbox"
          className="toggle"
          defaultChecked={state.inputs?.requireTriage}
        />
      </FormLabel>

      <div className="flex items-center justify-between my-4">
        <h2 className="text-lg font-semibold label-star">Sections</h2>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => addItem(null)}
        >
          <FaPlus size={12} className="mr-1" />
          Add section
        </button>
      </div>
      <ul className="menu rounded-box w-full">
        {titles.map((item) => (
          <li key={item.id}>
            <SectionView
              inputName="titles"
              titleItem={item}
              addTitle={addItem}
              removeTitle={removeItem}
            ></SectionView>
          </li>
        ))}
      </ul>
      {fieldErrors.titles && (
        <div className="text-sm text-red-500 whitespace-pre-line">
          {fieldErrors.titles.join("\n")}
        </div>
      )}
      <button className="btn btn-primary mt-6" type="submit">
        <FaSave size={19} className="mr-2" />
        Save
      </button>
    </form>
  );
}
