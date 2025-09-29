-- AlterTable
ALTER TABLE "public"."auth_user" ADD COLUMN     "boardingStatus" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "level" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "state" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."auth_user" ADD CONSTRAINT "auth_user_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."auth_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
