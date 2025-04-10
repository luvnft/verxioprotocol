/*
  Warnings:

  - You are about to drop the column `Collection` on the `LoyaltyPass` table. All the data in the column will be lost.
  - You are about to drop the column `Recipient` on the `LoyaltyPass` table. All the data in the column will be lost.
  - Added the required column `collection` to the `LoyaltyPass` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipient` to the `LoyaltyPass` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoyaltyPass" DROP COLUMN "Collection",
DROP COLUMN "Recipient",
ADD COLUMN     "collection" TEXT NOT NULL,
ADD COLUMN     "recipient" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LoyaltyProgram" ALTER COLUMN "creator" DROP DEFAULT;
