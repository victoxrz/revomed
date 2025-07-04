import NavBar from "@/components/NavBar";
import Link from "next/link";
import { IoLogOutOutline } from "react-icons/io5";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <NavBar>{children}</NavBar>;
}
