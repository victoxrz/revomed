import { validateSession } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLoggedIn = await validateSession();
  if (isLoggedIn) redirect("/");

  return <>{children}</>;
}
