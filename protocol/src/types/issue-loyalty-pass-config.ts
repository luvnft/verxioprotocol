import { KeypairSigner, PublicKey } from '@metaplex-foundation/umi'

export interface IssueLoyaltyPassConfig {
  collectionAddress: PublicKey
  recipient: PublicKey
  passName: string
  passMetadataUri: string
  assetSigner?: KeypairSigner
}
