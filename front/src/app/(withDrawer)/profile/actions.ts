"use server";
import { fetchClient } from "@/lib/actions";
import { Profile } from "./types";

export async function ProfileGet() {
  const response = await fetchClient.get<Profile>("/users/profile", {
    withAuth: true,
  });

  return response.data;
}
