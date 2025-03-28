-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isSuspended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "suspensionEndTime" TIMESTAMP(3),
ADD COLUMN     "suspensionTime" TIMESTAMP(3);
