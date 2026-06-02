"use client";
import { createContext, useContext } from "react";
/**
 * Creates a typed context with Provider and hook
 * @returns An object containing the Provider component, hook, and Context
 */
export function createTypedContext<T>() {
  const Context = createContext<T | undefined>(undefined);

  function Provider({
    children,
    value,
  }: {
    children: Readonly<React.ReactNode>;
    value: T;
  }) {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useTypedContext() {
    const ctx = useContext(Context);

    if (ctx === undefined) {
      throw Error("Undefined context value. Use inside Context Provider");
    }
    return ctx;
  }

  return { Provider, useTypedContext, Context } as const;
}
