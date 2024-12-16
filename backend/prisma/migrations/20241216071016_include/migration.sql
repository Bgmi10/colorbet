/*
  Warnings:

  - The `result` column on the `Bet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Gamestatus" AS ENUM ('PENDING', 'COMPLETED', 'IN_PROGRESS');

-- CreateEnum
CREATE TYPE "Betresult" AS ENUM ('PENDING', 'WIN', 'LOSE');

-- AlterTable
ALTER TABLE "Bet" DROP COLUMN "result",
ADD COLUMN     "result" "Betresult" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "status" "Gamestatus" NOT NULL DEFAULT 'PENDING';
