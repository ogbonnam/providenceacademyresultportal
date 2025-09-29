-- CreateTable
CREATE TABLE "public"."auth_user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'student',

    CONSTRAINT "auth_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."auth_key" (
    "id" TEXT NOT NULL,
    "hashed_password" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "auth_key_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."auth_session" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "active_expires" BIGINT NOT NULL,
    "idle_expires" BIGINT NOT NULL,

    CONSTRAINT "auth_session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_id_key" ON "public"."auth_user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_username_key" ON "public"."auth_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "auth_key_id_user_id_key" ON "public"."auth_key"("id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."auth_key" ADD CONSTRAINT "auth_key_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."auth_session" ADD CONSTRAINT "auth_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
