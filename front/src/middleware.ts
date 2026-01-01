import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const isLoggedIn = (await cookies()).has(process.env.AUTH_TOKEN_NAME!);

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/account/login", req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/patients/:path*",
    "/",
    "/visits/:path*",
    "/profile/:path*",
    "/templates/:path*",
  ],
};
