import { validateSession } from "@/lib/validateSession";
import { redirect } from "next/navigation";
import Script from "next/script";

export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoggedIn } = await validateSession();
  if (isLoggedIn) redirect("/");

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" async defer></Script>
      <div className="flex items-center justify-center min-h-screen">
        <video
          src="/videoplayback.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 backdrop-blur-md" />
        {children}
      </div>
    </>
  );
}
