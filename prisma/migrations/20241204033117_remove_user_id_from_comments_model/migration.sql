/*
  Warnings:

  - You are about to drop the column `userId` on the `PostComments` table. All the data in the column will be lost.
  - Added the required column `username` to the `PostComments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PostComments" DROP CONSTRAINT "PostComments_userId_fkey";

-- AlterTable
ALTER TABLE "PostComments" DROP COLUMN "userId",
ADD COLUMN     "username" TEXT NOT NULL;
