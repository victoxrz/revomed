import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "./lib/dal";

export async function middleware(req: NextRequest) {
  const isLoggedIn = await validateSession();

  // if (!isLoggedIn) {
  //   return NextResponse.redirect(new URL("/account/login", req.nextUrl.origin));
  // }

  const publicPaths = ["/account/login", "/account/signup"];
  if (publicPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }
}

export const config = {
  matcher: ["/patients/:path*", "/", "/visits/:path*"],
};
