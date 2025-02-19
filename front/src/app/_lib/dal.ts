import "server-only";
// "use server";
import { cookies } from "next/headers";

interface JwtPayload {
  exp: number;
}

export async function validateSession() {
  const expInSeconds = (payload: JwtPayload) => {
    return payload.exp * 1000;
  };

  const cookie = (await cookies()).get(process.env.AUTH_TOKEN_NAME!);
  if (!cookie) return false;

  const payload = Buffer.from(cookie.value.split(".")[1], "base64").toString();
  let decodedPayload: JwtPayload;
  try {
    decodedPayload = JSON.parse(payload);
  } catch (e) {
    // good to be logged in the server logs
    console.error("Failed to parse payload", e);
    return false;
  }

  return expInSeconds(decodedPayload) >= Date.now();
}

export async function verifyIntegrity() {
  const isValid = await validateSession();
  if (!isValid) return false;

  const cookie = (await cookies()).get(process.env.AUTH_TOKEN_NAME!);
  if (!cookie) return false;

  const [header, payload, signature] = cookie.value.split(".");

  const key = await crypto.subtle.importKey(
    "raw",
    Buffer.from(process.env.SECRET!),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify", "sign"]
  );

  return await crypto.subtle.verify(
    "HMAC",
    key,
    Buffer.from(signature, "base64url"),
    Buffer.from(header + "." + payload)
  );
}
