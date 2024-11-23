/*
  Warnings:

  - Added the required column `text` to the `PostComments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PostComments" ADD COLUMN     "text" TEXT NOT NULL;
