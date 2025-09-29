-- CreateEnum
CREATE TYPE "public"."ScoreStatus" AS ENUM ('draft', 'submitted', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "public"."Score" ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "status" "public"."ScoreStatus" NOT NULL DEFAULT 'draft';

-- AddForeignKey
ALTER TABLE "public"."Score" ADD CONSTRAINT "Score_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
