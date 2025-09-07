"use client";
import FormLabel from "@/components/FormLabel";
import AutocompleteTextarea from "@/components/AutocompleteTextarea";
import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaSave } from "react-icons/fa";
import TriageView from "../../patients/_components/triages/TriageView";
import { useQuery } from "@tanstack/react-query";
import { getById } from "@/lib/actions/visitTemplate.actions";
import { VisitTemplate } from "@/app/(withDrawer)/templates/types";
import { visit } from "@/lib/actions";
import { usePatientTabsContext } from "../../patients/_components/PatientTabsProvider";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

export default function VisitForm({ className }: { className?: string }) {
  const ctx = usePatientTabsContext();

  const [templateId, setTemplateId] = useState(ctx.template.id);

  const { data, isLoading } = useQuery<VisitTemplate>({
    queryKey: ["visitTemplateGet", templateId],
    queryFn: async () => (await getById(templateId)) ?? ctx.template,
    refetchOnWindowFocus: false,
  });
  ctx.template = data ?? ctx.template;

  const content = (
    <>
      <Link
        href={`/patients/${ctx.patient.id}`}
        className="btn btn-square btn-ghost btn-sm"
      >
        <IoArrowBack size={19} />
      </Link>
      <FormLabel label="Select a template">
        <select
          className="select flex mb-4 w-1/3"
          value={ctx.template.id}
          onChange={(e) => setTemplateId(Number(e.target.value))}
        >
          {ctx.templateNames.map((template) => (
            <option value={template.id} key={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </FormLabel>
      {isLoading ? (
        <>
          {/* // modify the skeleton once decided with the view page */}
          <div className="skeleton bg-base-100 animate-pulse w-full mx-auto max-w-2xl h-40"></div>
          <div className="skeleton bg-base-100 animate-pulse w-full mx-auto mt-6 max-w-2xl h-40"></div>
        </>
      ) : (
        <CreateVisitForm />
      )}
    </>
  );

  return className ? <div className={className}>{content}</div> : content;
}

function CreateVisitForm() {
  const ctx = usePatientTabsContext();
  const [state, action] = useActionState(visit.create, {
    inputs: null,
    message: "",
  });

  const fieldErrors = state?.errors?.fieldErrors || {};

  const triageData = ctx.triage ? (
    <TriageView className="bg-base-100 p-6 mb-4" triage={ctx.triage} />
  ) : (
    <div role="alert" className="alert alert-error alert-soft mb-2">
      No triage was found. You can't create a visit without a triage.
    </div>
  );

  useEffect(() => {
    if (state.message) {
      if (state.isSuccesful) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form action={action}>
      <input type="hidden" name="patientId" value={ctx.patient.id} />
      <input type="hidden" name="templateId" value={ctx.template.id} />
      {ctx.template.requireTriage && triageData}
      {ctx.template.titles.map((element, index) => {
        const subs = element.slice(1);
        const content =
          subs.length > 0 ? (
            subs.map((e, i) => (
              <div key={e}>
                <span className="label text-sm mb-1 gap-0">{e}</span>
                <AutocompleteTextarea
                  name={`fields-${index}-${i + 1}`}
                  templateId={ctx.template.id}
                  defaultValue={state.inputs?.fields[`${index}-${i + 1}`] || ""}
                  fieldKey={`${index}-${i + 1}`}
                />
              </div>
            ))
          ) : (
            <AutocompleteTextarea
              name={`fields-${index}-0`}
              templateId={ctx.template.id}
              defaultValue={state.inputs?.fields[`${index}-0`] || ""}
              fieldKey={`${index}-0`}
              className="textarea textarea-bordered grow flex mb-3 mt-1 w-full"
            />
          );

        return (
          <div key={element[0]} className="bg-base-100 rounded-box p-6 mb-6">
            <span className="inline-flex font-bold text-sm gap-0">
              {element[0]}
            </span>
            {content}
          </div>
        );
      })}
      {fieldErrors && (
        <div className="text-sm text-red-500">{fieldErrors.fields}</div>
      )}
      <button type="submit" className="btn btn-primary">
        <FaSave size={19} />
        Save
      </button>
    </form>
  );
}

/**
// components/AutocompleteInput.jsx
import { useState, useEffect, useRef } from 'react';

export default function AutocompleteInput({ fieldKey, endpoint='/api/suggestions', minChars=2, limit=8 }) {
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const controllerRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (q.length < minChars) { setItems([]); setOpen(false); return; }
    // debounce
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();
      try {
        const url = `${endpoint}?q=${encodeURIComponent(q)}&limit=${limit}&fieldKey=${encodeURIComponent(fieldKey)}`;
        const res = await fetch(url, { signal: controllerRef.current.signal });
        if (!res.ok) return;
        const data = await res.json();
        setItems(data);
        setOpen(Boolean(data && data.length));
        setHighlight(0);
      } catch (e) {}
    }, 200);
    return () => clearTimeout(debounceRef.current);
  }, [q]);

  function onKeyDown(e) {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight((h) => Math.min(h+1, items.length-1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setHighlight((h) => Math.max(h-1, 0)); }
    if (e.key === 'Enter')     { e.preventDefault(); if (items[highlight]) select(items[highlight]); }
    if (e.key === 'Escape')    { setOpen(false); }
  }

  function select(item) {
    // set input to chosen value
    setQ(item.value);
    setOpen(false);
    // optionally emit event with selected suggestion
    // onSelect?.(item)
  }

  return (
    <div className="relative" onKeyDown={onKeyDown}>
      <input
        value={q}
        onChange={(e)=>setQ(e.target.value)}
        className="border p-2 w-full"
        placeholder="Type..."
        aria-autocomplete="list"
      />
      {open && (
        <ul className="absolute z-10 bg-white border w-full max-h-60 overflow-auto">
          {items.map((it, idx) => (
            <li key={idx}
                className={`p-2 cursor-pointer ${idx===highlight? 'bg-gray-200':''}`}
                onMouseDown={()=>select(it)}
                onMouseEnter={()=>setHighlight(idx)}
            >
              <div className="text-sm">{it.title}</div>
              <div className="text-xs text-gray-600">{highlightMatch(it.value, q)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function highlightMatch(value, q) {
  const i = value.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return value;
  return (<>{value.slice(0,i)}<strong>{value.slice(i, i+q.length)}</strong>{value.slice(i+q.length)}</>);
}

*/
