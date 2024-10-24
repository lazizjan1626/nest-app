/*
  Warnings:

  - You are about to drop the `stuff` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "stuff";

-- CreateTable
CREATE TABLE "Stuff" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stuff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stuff_phone_number_key" ON "Stuff"("phone_number");
