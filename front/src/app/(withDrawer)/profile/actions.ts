"use server";

import { fetchGet } from "@/lib/fetchWrap";

export type Profile = {
  email: string;
};

export async function ProfileGet() {
  const response = await fetchGet<Profile>("/users/profile", {
    withAuth: true,
  });

  if (response.message) {
    console.error("Error fetching visit template: ", response.message);
  }

  return response.data;
}
