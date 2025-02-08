import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // https://southcla.ws/how-to-implement-logout-nextjs-cache-revalidate
  (await cookies()).delete(process.env.AUTH_TOKEN_NAME!);

  console.log("logout", req.nextUrl.locale);
  return NextResponse.redirect("http://127.0.0.1:3000/account/login", {
    headers: {
      "Clear-Site-Data": `"*"`,
      "Cache-Control": "no-store",
    },
  });
}
