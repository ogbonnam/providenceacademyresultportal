/*
  Warnings:

  - A unique constraint covering the columns `[studentSubjectId]` on the table `Score` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Score_studentSubjectId_key" ON "public"."Score"("studentSubjectId");
