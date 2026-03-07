-- AlterTable
ALTER TABLE "Order" ADD COLUMN "state" TEXT NOT NULL DEFAULT '';

-- Update existing records with a default value
UPDATE "Order" SET "state" = 'N/A' WHERE "state" = '';

-- Remove default after updating existing records
ALTER TABLE "Order" ALTER COLUMN "state" DROP DEFAULT;
