/*
  Warnings:

  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Create default categories if they don't exist
INSERT INTO "Category" (id, name, "createdAt")
SELECT 
  gen_random_uuid(), 
  unnest(ARRAY['health', 'pickle', 'combo', 'Everyday essentials powders (spices)']), 
  NOW()
ON CONFLICT (name) DO NOTHING;

-- Step 2: Add categoryId column (nullable first)
ALTER TABLE "Product" ADD COLUMN "categoryId" TEXT;

-- Step 3: Migrate existing data - map old category strings to new category IDs
UPDATE "Product" p
SET "categoryId" = c.id
FROM "Category" c
WHERE p.category = c.name;

-- Step 4: Make categoryId NOT NULL
ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;

-- Step 5: Drop old index and column
DROP INDEX IF EXISTS "Product_category_idx";
ALTER TABLE "Product" DROP COLUMN "category";

-- Step 6: Create new index
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- Step 7: Add foreign key constraint
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" 
FOREIGN KEY ("categoryId") REFERENCES "Category"("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;
