import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const countInit: Prisma.CounterCreateInput = {
    likeCount: 100,
    visitCount: 100,
};

export async function main() {
    await prisma.counter.create({ data: countInit });
}

main();
