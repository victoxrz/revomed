import { UserRole } from "@/app/(withDrawer)/users/types";
import { requireRoles } from "@/lib/dal/requireRoles";
import { notFound } from "next/navigation";

export default async function RequireRoles(allowed: UserRole[]) {
  const isAllowed = await requireRoles(allowed);

  if (!isAllowed) notFound();
}
