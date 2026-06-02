"use server";
import { FetchClient } from "@/lib/actions";
import { Profile } from "./types";

export async function ProfileGet() {
  const response = await FetchClient.get<Profile>("/users/profile", {
    withAuth: true,
  });

  return response.data;
}
