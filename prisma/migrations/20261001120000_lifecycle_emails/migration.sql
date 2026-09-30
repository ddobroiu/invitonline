-- E-mailurile din ciclul de viata (bun venit, ciorna neactivata, sfaturi dupa plata, rezumat RSVP, revenire)
-- si dezabonarea. Aditiva: coloane noi cu valori implicite si tabele noi; nu atinge datele existente.
--
-- "User"."marketingOptOut" / "marketingChoiceAt": bifa „Nu vreau emailuri cu sfaturi și noutăți” de la
--   inregistrare (Legea 506/2004 art. 12 alin. 2) sau dezabonarea din e-mail, cu momentul ei.
-- "EmailSettings": momentul lansarii (randul 1, pus aici). Doar conturile create dupa el primesc
--   e-mailurile periodice; conturile vechi nu primesc nimic nou.
-- "EmailLog": fiecare e-mail trimis; "dedupeKey" unic opreste dublurile.
-- "EmailUnsubscribe": adresele dezabonate.

-- AlterTable
ALTER TABLE "User" ADD COLUMN "marketingChoiceAt" TIMESTAMP(3),
ADD COLUMN "marketingOptOut" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "EmailSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "lifecycleLaunchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT,
    "eventId" TEXT,
    "kind" TEXT NOT NULL,
    "dedupeKey" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resendId" TEXT,
    "error" TEXT,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailUnsubscribe" (
    "email" TEXT NOT NULL,
    "unsubscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailLogId" TEXT,

    CONSTRAINT "EmailUnsubscribe_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailLog_dedupeKey_key" ON "EmailLog"("dedupeKey");

-- CreateIndex
CREATE INDEX "EmailLog_email_sentAt_idx" ON "EmailLog"("email", "sentAt" DESC);

-- CreateIndex
CREATE INDEX "EmailLog_kind_sentAt_idx" ON "EmailLog"("kind", "sentAt" DESC);

-- CreateIndex
CREATE INDEX "EmailLog_userId_idx" ON "EmailLog"("userId");

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Momentul lansarii: acum, cand ruleaza migrarea.
INSERT INTO "EmailSettings" ("id", "lifecycleLaunchedAt") VALUES (1, CURRENT_TIMESTAMP) ON CONFLICT DO NOTHING;
