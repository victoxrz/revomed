"use client";
import EntityTabs from "@/components/EntityTabs";
import { useUserTabsContext } from "./UserTabsProvider";
import UserForm from "./UserForm";
import { User } from "@/lib/actions";

export default function UserTabs() {
  const ctx = useUserTabsContext();

  return (
    <EntityTabs
      tabs={[
        {
          label: "Details",
          content: (
            <UserForm
              className="p-6 bg-base-100 rounded-field max-w-3xl mx-auto"
              mutateAction={User.update}
              user={ctx.user}
            />
          ),
        },
      ]}
    />
  );
}
