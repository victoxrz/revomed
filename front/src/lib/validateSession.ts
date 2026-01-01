import "server-only";
// "use server";
import { cookies } from "next/headers";

export async function validateSession(): Promise<{ isLoggedIn: boolean }> {
  return {
    isLoggedIn: (await cookies()).has(process.env.AUTH_TOKEN_NAME!),
  };
}
