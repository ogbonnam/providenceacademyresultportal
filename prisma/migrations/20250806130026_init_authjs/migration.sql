/*
  Warnings:

  - You are about to drop the column `active_expires` on the `auth_session` table. All the data in the column will be lost.
  - You are about to drop the column `idle_expires` on the `auth_session` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `auth_session` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `auth_user` table. All the data in the column will be lost.
  - You are about to drop the `auth_key` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sessionToken]` on the table `auth_session` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `auth_user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expires` to the `auth_session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionToken` to the `auth_session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `auth_session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `auth_user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."auth_key" DROP CONSTRAINT "auth_key_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."auth_session" DROP CONSTRAINT "auth_session_user_id_fkey";

-- DropIndex
DROP INDEX "public"."auth_user_id_key";

-- DropIndex
DROP INDEX "public"."auth_user_username_key";

-- AlterTable
ALTER TABLE "public"."auth_session" DROP COLUMN "active_expires",
DROP COLUMN "idle_expires",
DROP COLUMN "user_id",
ADD COLUMN     "expires" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sessionToken" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."auth_user" DROP COLUMN "username",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "password" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."auth_key";

-- CreateTable
CREATE TABLE "public"."auth_account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "auth_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."auth_verification_token" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_account_provider_providerAccountId_key" ON "public"."auth_account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_verification_token_token_key" ON "public"."auth_verification_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "auth_verification_token_identifier_token_key" ON "public"."auth_verification_token"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "auth_session_sessionToken_key" ON "public"."auth_session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_email_key" ON "public"."auth_user"("email");

-- AddForeignKey
ALTER TABLE "public"."auth_account" ADD CONSTRAINT "auth_account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."auth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."auth_session" ADD CONSTRAINT "auth_session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."auth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
