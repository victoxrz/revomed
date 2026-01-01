import { getGoogleConfig } from "@/lib/googleOidc";
import * as client from "openid-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { fetchClient } from "@/lib/actions";

export async function GET(req: NextRequest) {
  const config = await getGoogleConfig();
  const cookieStore = await cookies();
  const codeVerifier = cookieStore.get("code_verifier")?.value;

  if (!codeVerifier) {
    return NextResponse.redirect(new URL("/account/login", req.url));
  }

  try {
    const tokens = await client.authorizationCodeGrant(
      config,
      new URL(req.url),
      {
        pkceCodeVerifier: codeVerifier,
        expectedState: undefined,
        idTokenExpected: true,
      },
    );

    // Remove code verifier cookie
    cookieStore.delete("code_verifier");

    const claims = tokens.claims();

    if (!claims || !tokens.id_token) {
      return NextResponse.redirect(new URL(`/account/login`));
    }

    // exchange id_token for our own session id
    const response = await fetchClient.post<{ sessionId: string }>(
      "/users/google-auth",
      {
        idToken: tokens.id_token,
      },
    );

    if (!response.data) {
      return NextResponse.redirect(new URL(`/account/login`));
    }

    cookieStore.set({
      name: process.env.AUTH_TOKEN_NAME!,
      value: response.data.sessionId,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    return NextResponse.redirect(new URL("/", req.url));
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(new URL("/account/login", req.url));
  }
}
