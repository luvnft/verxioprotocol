-- AlterTable
ALTER TABLE "LoyaltyPass" ALTER COLUMN "Collection" SET DEFAULT 'default_collection',
ALTER COLUMN "Recipient" SET DEFAULT 'default_recipient';

-- AlterTable
ALTER TABLE "LoyaltyProgram" ALTER COLUMN "creator" SET DEFAULT 'default_creator';
