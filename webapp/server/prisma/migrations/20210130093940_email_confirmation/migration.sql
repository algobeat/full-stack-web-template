-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailConfirmationToken" TEXT,
ADD COLUMN     "emailConfirmationExpires" TIMESTAMP(3);
