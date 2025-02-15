"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const getLikeCount = async () => {
  const count = await db.counter.findFirst({
    where: {
      id: 1,
    },
  });

  return count?.likeCount ?? 96;
};

export const getVisitCount = async () => {
  const count = await db.counter.findFirst({
    where: {
      id: 1,
    },
  });

  return count?.visitCount ?? 96;
};

export const incrementLikeCount = async () => {
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
};

export const incrementVisitCount = async () => {
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
};
