-- AlterTable
ALTER TABLE "Category" ADD COLUMN "showOnHome" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Category" ADD COLUMN "displayOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Category_showOnHome_displayOrder_idx" ON "Category"("showOnHome", "displayOrder");