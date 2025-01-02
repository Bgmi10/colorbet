-- CreateTable
CREATE TABLE "LoginActivity" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "loginStatus" TEXT NOT NULL,
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
    "platform" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "LoginActivity_id_key" ON "LoginActivity"("id");

-- AddForeignKey
ALTER TABLE "LoginActivity" ADD CONSTRAINT "LoginActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
