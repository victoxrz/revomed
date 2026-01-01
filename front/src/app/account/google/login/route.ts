import { getGoogleConfig } from "@/lib/googleOidc";
import * as client from "openid-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const config = await getGoogleConfig();
  const codeVerifier = client.randomPKCECodeVerifier();
  const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);

  (await cookies()).set("code_verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 300, // 5 minutes
  });

  const redirectUri = new URL("/account/google/callback", req.nextUrl.origin);

  const redirectTo = client.buildAuthorizationUrl(config, {
    redirect_uri: redirectUri.toString(),
    scope: "openid email",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  });

  return NextResponse.redirect(redirectTo);
}
