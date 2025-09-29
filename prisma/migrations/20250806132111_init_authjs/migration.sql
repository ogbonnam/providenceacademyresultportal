/*
  Warnings:

  - Made the column `email` on table `auth_user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."auth_user" ALTER COLUMN "email" SET NOT NULL;
