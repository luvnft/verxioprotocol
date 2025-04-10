/*
  Warnings:

  - Changed the type of `keypair` on the `LoyaltyProgram` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LoyaltyProgram" DROP COLUMN "keypair",
ADD COLUMN     "keypair" JSONB NOT NULL;
