import "server-only";
// "use server";
import { cookies } from "next/headers";
import { decodeJwt, jwtVerify } from "jose";

export type Role = "Medic" | "Pacient";

interface JwtPayload {
  exp: number;
  email: string;
  templateId: string;
  role: Role;
}

export async function validateSession(): Promise<{ isLoggedIn: boolean }> {
  const cookie = (await cookies()).get(process.env.AUTH_TOKEN_NAME!);
  if (!cookie)
    return {
      isLoggedIn: false,
    };

  try {
    await jwtVerify<JwtPayload>(
      cookie.value,
      new TextEncoder().encode(process.env.SECRET!)
    );
  } catch (e) {
    console.error("session expired: ", e);
    return {
      isLoggedIn: false,
    };
  }
  return {
    isLoggedIn: true,
  };
}

export async function decodeToken() {
  const cookie = (await cookies()).get(process.env.AUTH_TOKEN_NAME!);
  if (!cookie) return;
  return decodeJwt<JwtPayload>(cookie.value);
}

export async function requireRoles(allowed: Role[]) {
  const payload = await decodeToken();
  if (!payload) return false;

  if (allowed.indexOf(payload?.role) === -1) return false;

  return true;
}
