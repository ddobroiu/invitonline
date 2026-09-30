-- Resetarea parolei si revocarea sesiunilor. Aditiva: doua coloane noi, NULL implicit, si un index;
-- nu atinge datele existente.
--
-- "User"."passwordChangedAt": momentul ultimei schimbari/stergeri a parolei (resetare prin e-mail sau
--   legarea cu Google a unui cont cu adresa nedovedita). Sesiunile (JWT) emise inainte nu mai sunt primite.
-- "AuthToken"."ipHash": SHA-256 al adresei IP care a cerut linkul, pentru limita de cereri pe IP.

-- AlterTable
ALTER TABLE "User" ADD COLUMN "passwordChangedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "AuthToken" ADD COLUMN "ipHash" TEXT;

-- CreateIndex
CREATE INDEX "AuthToken_ipHash_idx" ON "AuthToken"("ipHash");
