import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      password: process.env.REDIS_PASSWORD,
    });

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    redisClient.on("error", (err: any) => {
      console.error("Redis Client Error", err);
    });
  }

  return redisClient;
}
