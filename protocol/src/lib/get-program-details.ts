import { VerxioContext } from '@schemas/verxio-context'
import { validateCollectionState } from '@utils/validate-collection-state'
import { fetchCollection } from '@metaplex-foundation/mpl-core'
import { ATTRIBUTE_KEYS } from './constants'

export interface ProgramTier {
  name: string
  xpRequired: number
  rewards: string[]
}

export interface ProgramMetadata {
  hostName: string
  brandColor?: string
  [key: string]: any
}

export async function getProgramDetails(context: VerxioContext): Promise<{
  name: string
  uri: string
  collectionAddress: string
  updateAuthority: string
  numMinted: number
  transferAuthority: string
  creator: string
  tiers: ProgramTier[]
  pointsPerAction: Record<string, number>
  metadata: ProgramMetadata
}> {
  validateCollectionState(context)

  try {
    const collection = await fetchCollection(context.umi, context.collectionAddress!)

    // Get attributes from the collection
    const attributes = collection.attributes?.attributeList || []

    // Find and parse the required attributes
    const tiersAttr = attributes.find((attr) => attr.key === ATTRIBUTE_KEYS.TIERS)
    const pointsAttr = attributes.find((attr) => attr.key === ATTRIBUTE_KEYS.POINTS_PER_ACTION)
    const metadataAttr = attributes.find((attr) => attr.key === ATTRIBUTE_KEYS.METADATA)

    // Parse the attributes
    const tiers = tiersAttr ? JSON.parse(tiersAttr.value) : []
    const pointsPerAction = pointsAttr ? JSON.parse(pointsAttr.value) : {}
    const metadata = metadataAttr ? JSON.parse(metadataAttr.value) : {}

    return {
      name: collection.name,
      uri: collection.uri,
      collectionAddress: collection.publicKey,
      updateAuthority: collection.updateAuthority,
      numMinted: collection.numMinted,
      transferAuthority: collection.permanentTransferDelegate?.authority.address?.toString()!,
      creator: collection.attributes?.attributeList.find((attr) => attr.key === ATTRIBUTE_KEYS.CREATOR)?.value!,
      tiers,
      pointsPerAction,
      metadata,
    }
  } catch (error) {
    throw new Error(`Failed to fetch program details: ${error}`)
  }
}
