/*
  Warnings:

  - You are about to drop the column `keypair` on the `LoyaltyProgram` table. All the data in the column will be lost.
  - Added the required column `privateKey` to the `LoyaltyProgram` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoyaltyProgram" DROP COLUMN "keypair",
ADD COLUMN     "privateKey" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "LoyaltyPass" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoyaltyPass_pkey" PRIMARY KEY ("id")
);

-- First add the columns as nullable
ALTER TABLE "LoyaltyPass" ADD COLUMN "Collection" TEXT;
ALTER TABLE "LoyaltyPass" ADD COLUMN "Recipient" TEXT;
ALTER TABLE "LoyaltyProgram" ADD COLUMN "creator" TEXT;

-- Update existing records with default values
UPDATE "LoyaltyPass" SET "Collection" = 'default_collection' WHERE "Collection" IS NULL;
UPDATE "LoyaltyPass" SET "Recipient" = 'default_recipient' WHERE "Recipient" IS NULL;
UPDATE "LoyaltyProgram" SET "creator" = 'default_creator' WHERE "creator" IS NULL;

-- Now make the columns required
ALTER TABLE "LoyaltyPass" ALTER COLUMN "Collection" SET NOT NULL;
ALTER TABLE "LoyaltyPass" ALTER COLUMN "Recipient" SET NOT NULL;
ALTER TABLE "LoyaltyProgram" ALTER COLUMN "creator" SET NOT NULL;
