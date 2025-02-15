-- CreateTable
CREATE TABLE "Counter" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Counter_pkey" PRIMARY KEY ("id")
);
