"use server";

import { db } from "@/lib/db";

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
