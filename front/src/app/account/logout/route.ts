import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  (await cookies()).delete(process.env.AUTH_TOKEN_NAME!);

  return NextResponse.redirect(new URL("/account/login", req.url), {
    headers: {
      "Clear-Site-Data": `"*"`,
      "Cache-Control": "no-store",
    },
  });
}
