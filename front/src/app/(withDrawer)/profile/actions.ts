"use server";
import { fetchClient } from "@/lib/actions";
import { Role } from "@/lib/requireRoles";

export type Profile = {
  email: string;
  userRole: Role;
  specialty?: string;
};

export async function ProfileGet() {
  const response = await fetchClient.get<Profile>("/users/profile", {
    withAuth: true,
  });

  return response.data;
}
