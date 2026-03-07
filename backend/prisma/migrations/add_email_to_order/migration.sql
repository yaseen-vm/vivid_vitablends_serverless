-- AlterTable
ALTER TABLE "Order" ADD COLUMN "email" TEXT NOT NULL DEFAULT '';

-- Update existing records with a placeholder email
UPDATE "Order" SET "email" = 'noemail@example.com' WHERE "email" = '';
