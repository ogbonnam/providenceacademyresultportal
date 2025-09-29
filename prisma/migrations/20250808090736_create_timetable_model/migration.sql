-- CreateEnum
CREATE TYPE "public"."DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateEnum
CREATE TYPE "public"."TimeSlot" AS ENUM ('TIME_08_30_09_30', 'TIME_09_30_10_30', 'TIME_10_30_11_00_BREAK', 'TIME_11_00_12_00', 'TIME_12_00_13_00', 'TIME_13_00_14_00_BREAK', 'TIME_14_00_15_00');

-- DropForeignKey
ALTER TABLE "public"."Score" DROP CONSTRAINT "Score_studentSubjectId_fkey";

-- CreateTable
CREATE TABLE "public"."TimetableEntry" (
    "id" TEXT NOT NULL,
    "day" "public"."DayOfWeek" NOT NULL,
    "time" "public"."TimeSlot" NOT NULL,
    "subjectId" TEXT,
    "teacherId" TEXT,

    CONSTRAINT "TimetableEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TimetableEntry_day_time_key" ON "public"."TimetableEntry"("day", "time");

-- AddForeignKey
ALTER TABLE "public"."Score" ADD CONSTRAINT "Score_studentSubjectId_fkey" FOREIGN KEY ("studentSubjectId") REFERENCES "public"."StudentSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimetableEntry" ADD CONSTRAINT "TimetableEntry_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimetableEntry" ADD CONSTRAINT "TimetableEntry_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
