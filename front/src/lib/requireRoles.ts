import "server-only";
import { cookies } from "next/headers";
import { getRedisClient } from "./redis";

export type Role = "Medic" | "Patient" | "Admin" | "User";

interface SessionData {
  exp: number;
  email: string;
  templateId: string;
  userId: number;
  userRole: Role;
}

export async function decodeSession() {
  const cookie = (await cookies()).get(process.env.AUTH_TOKEN_NAME!);
  if (!cookie) return;

  const redis = await getRedisClient();
  const data = await redis.get(`session:${cookie.value}`);
  if (!data) return;

  return JSON.parse(data) as SessionData;
}

export async function requireRoles(allowed: Role[]) {
  const payload = await decodeSession();
  if (!payload) return false;

  if (allowed.indexOf(payload?.userRole) === -1) return false;

  return true;
}
