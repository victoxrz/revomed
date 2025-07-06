"use server";

import { fetchGet } from "@/lib/fetchWrap";

export type Profile = {
  email: string;
  templateId: number | null;
  userRole: "Medic" | "Patient";
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

export async function VisitTemplateGet(templateId: number) {
  const response = await fetchGet<{
    id: number;
    medicSpecialty: string;
    titles: string[];
  }>(`/templates/get/${templateId}`, {
    withAuth: true,
  });

  if (response.message) {
    console.error("Error fetching: ", response.message);
  }
  console.dir(response.data);

  return response.data;
}
