-- AlterTable
ALTER TABLE "testimonials" ADD COLUMN "customerId" TEXT;
ALTER TABLE "testimonials" ADD COLUMN "bookingId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "testimonials_bookingId_key" ON "testimonials"("bookingId");

-- CreateIndex
CREATE INDEX "testimonials_customerId_idx" ON "testimonials"("customerId");

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
