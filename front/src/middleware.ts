import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "./app/_lib/dal";

export async function middleware(req: NextRequest) {
  const isLoggedIn = await validateSession();
  console.log("middleware", req.nextUrl.origin);

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/account/login", req.nextUrl.origin));
  }

  const publicPaths = ["/account/login", "/account/signup"];
  console.log("middle", req.nextUrl.pathname);
  console.log("middle1", req.nextUrl.origin);
  if (publicPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/patients", req.nextUrl.origin));
  }
}

export const config = {
  matcher: ["/patients/:path*", "/"],
};
