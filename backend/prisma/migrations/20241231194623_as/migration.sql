/*
  Warnings:

  - Added the required column `amountToTransfer` to the `Withdrawal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Withdrawal" ADD COLUMN     "amountToTransfer" INTEGER NOT NULL;
