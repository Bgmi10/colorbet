-- DropIndex
DROP INDEX "LoginActivity_id_key";

-- AlterTable
ALTER TABLE "LoginActivity" ADD CONSTRAINT "LoginActivity_pkey" PRIMARY KEY ("id");
