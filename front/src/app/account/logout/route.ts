import { cookies } from "next/headers";
import { NextResponse } from "next/server";
// import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  // https://southcla.ws/how-to-implement-logout-nextjs-cache-revalidate
  (await cookies()).delete(process.env.AUTH_TOKEN_NAME!);

  return NextResponse.redirect("http://localhost:3000", {
    headers: {
      "Clear-Site-Data": `"*"`,
      "Cache-Control": "no-store",
    },
  });
}
