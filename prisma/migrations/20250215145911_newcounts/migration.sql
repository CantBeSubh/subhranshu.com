/*
  Warnings:

  - You are about to drop the column `count` on the `Counter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Counter" DROP COLUMN "count",
ADD COLUMN     "like_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "visit_count" INTEGER NOT NULL DEFAULT 0;
