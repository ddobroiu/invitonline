-- Accounts (Google, e-mail links, password reset), RSVP menu + personal guest links, publish date,
-- Stripe webhook idempotency. Additive only: new nullable columns, new tables, and "password" becomes
-- nullable (existing rows keep their hash).

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;
ALTER TABLE "User" ADD COLUMN "emailVerified" TIMESTAMP(3),
ADD COLUMN "googleId" TEXT,
ADD COLUMN "image" TEXT;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN "publishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Guest" ADD COLUMN "menu" TEXT,
ADD COLUMN "token" TEXT,
ADD COLUMN "respondedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "AuthToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "termsVersion" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StripeEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Guest_token_key" ON "Guest"("token");

-- CreateIndex
CREATE UNIQUE INDEX "AuthToken_tokenHash_key" ON "AuthToken"("tokenHash");

-- CreateIndex
CREATE INDEX "AuthToken_email_idx" ON "AuthToken"("email");

-- Backfill: invitations already paid count as published at their last update
UPDATE "Event" SET "publishedAt" = "updatedAt" WHERE "isPaid" = true AND "publishedAt" IS NULL;
