import "server-only";
import { cookies } from "next/headers";
import { getRedisClient } from "../redis";
import { UserRole } from "@/app/(withDrawer)/users/types";
import { SessionData } from "./types";

export async function decodeSession() {
  const cookie = (await cookies()).get(process.env.AUTH_TOKEN_NAME!);
  if (!cookie) return;

  const redis = await getRedisClient();
  const data = await redis.get(`session:${cookie.value}`);
  if (!data) return;

  return JSON.parse(data) as SessionData;
}

export async function requireRoles(allowed: UserRole[]) {
  const payload = await decodeSession();
  if (!payload) return false;

  if (allowed.indexOf(payload?.userRole) === -1) return false;

  return true;
}

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const payload = await decodeSession();
  return payload?.userRole ?? null;
}
