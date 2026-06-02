import NavBar from "@/components/NavBar";
import { getCurrentUserRole } from "@/lib/dal/requireRoles";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userRole = await getCurrentUserRole();

  if (!userRole) {
    redirect("/account/login");
  }

  return <NavBar userRole={userRole}>{children}</NavBar>;
}
