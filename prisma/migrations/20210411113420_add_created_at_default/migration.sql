/*
  Warnings:

  - You are about to drop the column `createdOn` on the `SignupItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SignupItem" DROP COLUMN "createdOn",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
