"use client";
import { createTypedContext } from "@/components/ContextFactory";
import { User } from "../types";

// Patient Tabs specific context
export type UserTabsValue = {
  user: User;
};

const { Provider, useTypedContext, Context } =
  createTypedContext<UserTabsValue>();

export const UserTabsProvider = Provider;
export const useUserTabsContext = useTypedContext;
export const UserTabsContext = Context;
