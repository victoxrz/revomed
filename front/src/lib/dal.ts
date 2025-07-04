import "server-only";
// "use server";
import { cookies } from "next/headers";
import { decodeJwt, jwtVerify } from "jose";

interface JwtPayload {
  exp: number;
  email: string;
  templateId: string;
}

export async function validateSession() {
  const cookie = (await cookies()).get(process.env.AUTH_TOKEN_NAME!);
  if (!cookie) return false;

  try {
    await jwtVerify<JwtPayload>(
      cookie.value,
      new TextEncoder().encode(process.env.SECRET!)
    );
  } catch (e) {
    console.error("session expired: ", e);
    return false;
  }
  return true;
}

export async function decodeToken() {
  const cookie = (await cookies()).get(process.env.AUTH_TOKEN_NAME!);
  if (!cookie) return;
  return decodeJwt<JwtPayload>(cookie.value);
}
