-- CreateTable
CREATE TABLE "public"."EducationalVideo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subjectId" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,

    CONSTRAINT "EducationalVideo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."EducationalVideo" ADD CONSTRAINT "EducationalVideo_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EducationalVideo" ADD CONSTRAINT "EducationalVideo_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
