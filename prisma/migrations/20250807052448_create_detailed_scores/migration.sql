/*
  Warnings:

  - You are about to drop the column `notes` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Score` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Score" DROP COLUMN "notes",
DROP COLUMN "score",
ADD COLUMN     "attendance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "exam" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "score1" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "score2" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL DEFAULT 0;
