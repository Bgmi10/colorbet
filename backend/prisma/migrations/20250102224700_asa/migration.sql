/*
  Warnings:

  - You are about to drop the column `loginStatus` on the `LoginActivity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LoginActivity" DROP COLUMN "loginStatus";

-- CreateIndex
CREATE INDEX "LoginActivity_userId_idx" ON "LoginActivity"("userId");

-- CreateIndex
CREATE INDEX "LoginActivity_sessionToken_idx" ON "LoginActivity"("sessionToken");
