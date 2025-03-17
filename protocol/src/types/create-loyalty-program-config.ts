import { KeypairSigner, PublicKey } from '@metaplex-foundation/umi'
import { LoyaltyProgramTier } from '@/types/loyalty-program-tier'

export interface CreateLoyaltyProgramConfig {
  collectionSigner?: KeypairSigner
  metadataUri: string
  organizationName: string
  pointsPerAction: Record<string, number>
  programAuthority: PublicKey
  tiers: LoyaltyProgramTier[]
}
