/*
  Warnings:

  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- Step 1: Add userId column as nullable first
ALTER TABLE "Order" ADD COLUMN "userId" TEXT;

-- Step 2: Create users for existing orders (handle duplicates)
INSERT INTO "User" ("id", "name", "phone", "createdAt")
SELECT DISTINCT
    gen_random_uuid()::text as id,
    FIRST_VALUE("customerName") OVER (PARTITION BY "phone" ORDER BY "createdAt") as name,
    "phone",
    MIN("createdAt") OVER (PARTITION BY "phone") as "createdAt"
FROM "Order"
WHERE "phone" IS NOT NULL
ON CONFLICT ("phone") DO NOTHING;

-- Step 3: Update existing orders with userId
UPDATE "Order" 
SET "userId" = "User"."id"
FROM "User"
WHERE "Order"."phone" = "User"."phone";

-- Step 4: Make userId NOT NULL
ALTER TABLE "Order" ALTER COLUMN "userId" SET NOT NULL;

-- Step 5: Update status default
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
