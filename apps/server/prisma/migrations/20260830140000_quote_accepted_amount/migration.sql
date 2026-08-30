-- AlterEnum
ALTER TYPE "QuoteStatus" ADD VALUE 'ACCEPTED' AFTER 'QUOTED';

-- AlterTable
ALTER TABLE "quote_requests" ADD COLUMN "quotedAmount" DECIMAL(10,2);
