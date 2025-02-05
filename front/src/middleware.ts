import { NextRequest, NextResponse } from "next/server";
import { validateSession, verifyIntegrity } from "./app/_lib/dal";

export async function middleware(req: NextRequest) {
  const isLoggedIn = await validateSession();

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/account/login", req.url));
  }

  const publicPaths = ["/account/login", "/account/signup"];
  if (publicPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/patients", req.url));
  }
}

export const config = {
  matcher: ["/patients/:path*", "/"],
};
