"use server";

import { db } from "@/lib/db";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
  throw new Error(
    "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables are required.",
  );
}
const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "5 s"),
});

export const getLikeCount = async () => {
  try {
    const count = await db.counter.findFirst({
      where: {
        id: 1,
      },
    });

    return count?.likeCount ?? 96;
  } catch (error) {
    console.error("Error getting like count:", error);
    return 96;
  }
};

export const getVisitCount = async () => {
  try {
    const count = await db.counter.findFirst({
      where: {
        id: 1,
      },
    });

    return count?.visitCount ?? 96;
  } catch (error) {
    console.error("Error getting visit count:", error);
    return 96;
  }
};

export const incrementLikeCount = async () => {
  try {
    const headerStore = await headers();
    const clientIp = headerStore.get("x-forwarded-for") ?? "127.0.0.1";

    const result = await ratelimit.limit(clientIp);
    if (!result.success) {
      throw new Error(
        `Rate limit exceeded. Retry in ${dayjs(result.reset).format("ss")} seconds.`,
      );
    }
    await db.counter.update({
      where: {
        id: 1,
      },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });
    revalidatePath("/", "page");
  } catch (error) {
    console.error("Error incrementing like count:", error);
    throw error;
  }
};

export const incrementVisitCount = async () => {
  try {
    const cookieStore = await cookies();
    const hasVisited = cookieStore.get("hasVisited");

    if (!hasVisited) {
      await db.counter.update({
        where: {
          id: 1,
        },
        data: {
          visitCount: {
            increment: 1,
          },
        },
      });
      cookieStore.set("hasVisited", "true", {
        expires: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
      });
    }
  } catch (error) {
    console.error("Error incrementing visit count:", error);
  }
};
