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
};

export const incrementVisitCount = async () => {
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
};
