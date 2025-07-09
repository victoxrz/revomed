import { requireRoles, Role } from "@/lib/dal";
import { notFound } from "next/navigation";

export default async function RequireRoles(allowed: Role[]) {
  const isAllowed = await requireRoles(allowed);

  if (!isAllowed) notFound();
}
