"use server";
import { Role } from "@/lib/dal";
import { fetchGet } from "@/lib/fetchWrap";

export type Profile = {
  email: string;
  templateId: number | null;
  userRole: Role;
};

export async function ProfileGet() {
  const response = await fetchGet<Profile>("/users/profile", {
    withAuth: true,
  });

  if (response.message) {
    console.error("Error fetching: ", response.message);
  }
  console.dir(response.data);

  return response.data;
}
