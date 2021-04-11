/*
  Warnings:

  - You are about to drop the column `userId` on the `SignupItem` table. All the data in the column will be lost.
  - Added the required column `createdByUserId` to the `SignupItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdOn` to the `SignupItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SignupItem" DROP CONSTRAINT "SignupItem_userId_fkey";

-- AlterTable
ALTER TABLE "SignupItem" DROP COLUMN "userId",
ADD COLUMN     "assigneeUserId" INTEGER,
ADD COLUMN     "createdByUserId" INTEGER NOT NULL,
ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "SignupItem" ADD FOREIGN KEY ("assigneeUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignupItem" ADD FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
