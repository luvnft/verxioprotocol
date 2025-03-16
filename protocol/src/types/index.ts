import { KeypairSigner, Umi, PublicKey as UmiPublicKey } from '@metaplex-foundation/umi'

// Initialize verxio context
export interface VerxioContext {
  umi: Umi
  programAuthority: UmiPublicKey
  collectionAddress?: UmiPublicKey
}

// Program data interface for creation
export interface LoyaltyProgramData {
  organizationName: string
  metadataUri: string
  tiers: Array<{
    name: string
    xpRequired: number
    rewards: string[]
  }>
  pointsPerAction: Record<string, number>
  programAuthority: UmiPublicKey
  collectionSigner?: KeypairSigner
}

// Configuration for issuing a loyalty pass
export interface IssueLoyaltyPassConfig {
  collectionAddress: UmiPublicKey
  recipient: UmiPublicKey
  passName: string
  passMetadataUri: string
  assetSigner?: KeypairSigner
}
