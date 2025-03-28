-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Gamestatus" AS ENUM ('PENDING', 'COMPLETED', 'IN_PROGRESS');

-- CreateEnum
CREATE TYPE "Betresult" AS ENUM ('PENDING', 'WIN', 'LOSE');

-- CreateEnum
CREATE TYPE "WithdrwalStatus" AS ENUM ('PENDING', 'FAILED', 'SUCCESS');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "avatarUrl" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginActivity" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "browser" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "deviceModel" TEXT,
    "ip" TEXT NOT NULL,
    "location" TEXT,
    "sessionToken" TEXT NOT NULL,
    "loginTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logoutTime" TIMESTAMP(3),
    "isp" TEXT,
    "connectionType" TEXT NOT NULL,
    "authMethod" TEXT NOT NULL DEFAULT 'emailandpassword',
    "platform" TEXT,

    CONSTRAINT "LoginActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "cardA" TEXT NOT NULL,
    "cardB" TEXT NOT NULL,
    "winner" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Gamestatus" NOT NULL DEFAULT 'PENDING',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bet" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "chosenSide" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "result" "Betresult" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commission" DOUBLE PRECISION NOT NULL DEFAULT 0.00,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "expiresIn" TIMESTAMP(3) NOT NULL,
    "createdIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "upiRef" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderMobile" TEXT NOT NULL,
    "remarks" TEXT,
    "senderName" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" SERIAL NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "ifscCode" TEXT NOT NULL,
    "upiId" TEXT,
    "bankName" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bankImage" TEXT NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountStatus" (
    "id" SERIAL NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "bankAccountId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Withdrawal" (
    "id" SERIAL NOT NULL,
    "withdrawalStatus" "WithdrwalStatus" NOT NULL DEFAULT 'PENDING',
    "userId" INTEGER NOT NULL,
    "bankAccountId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "transactionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "payoutMethod" TEXT NOT NULL,
    "withdrawalFee" INTEGER NOT NULL,
    "amountToTransfer" INTEGER NOT NULL,

    CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_memberId_key" ON "User"("memberId");

-- CreateIndex
CREATE INDEX "LoginActivity_userId_idx" ON "LoginActivity"("userId");

-- CreateIndex
CREATE INDEX "LoginActivity_sessionToken_idx" ON "LoginActivity"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_email_key" ON "Otp"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_upiRef_key" ON "Payment"("upiRef");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_accountNumber_key" ON "BankAccount"("accountNumber");

-- AddForeignKey
ALTER TABLE "LoginActivity" ADD CONSTRAINT "LoginActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountStatus" ADD CONSTRAINT "AccountStatus_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
