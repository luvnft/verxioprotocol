import { PublicKey as UmiPublicKey } from '@metaplex-foundation/umi'
import { fetchAsset, fetchCollection } from '@metaplex-foundation/mpl-core'
import { VerxioContext } from '@schemas/verxio-context'
import { PLUGIN_TYPES, ATTRIBUTE_KEYS } from '@lib/constants'

export interface AssetData {
  xp: number
  lastAction: string | null
  actionHistory: Array<{
    type: string
    points: number
    timestamp: number
    newTotal: number
  }>
  currentTier: string
  tierUpdatedAt: number
  rewards: string[]
  name: string
  uri: string
  owner: string
  pass: string
  metadata: {
    hostName: string
    brandColor?: string
    [key: string]: any
  }
  rewardTiers: Array<{
    name: string
    xpRequired: number
    rewards: string[]
  }>
}

export async function getAssetData(context: VerxioContext, passAddress: UmiPublicKey): Promise<AssetData | null> {
  try {
    const asset = await fetchAsset(context.umi, passAddress)
    const appDataPlugin = asset.appDatas?.find((p: any) => p.type === PLUGIN_TYPES.APP_DATA)

    if (!appDataPlugin || !appDataPlugin.data) {
      return null
    }

    // Get metadata from collection attributes using the asset's updateAuthority
    const collectionAddress = asset.updateAuthority.address
    if (!collectionAddress) {
      throw new Error('Collection address not found')
    }
    const collection = await fetchCollection(context.umi, collectionAddress)
    const metadataAttr = collection.attributes?.attributeList.find((attr) => attr.key === ATTRIBUTE_KEYS.METADATA)
    const metadata = metadataAttr ? JSON.parse(metadataAttr.value) : {}

    const tierAttr = collection.attributes?.attributeList.find((attr) => attr.key === ATTRIBUTE_KEYS.TIERS)
    const rewardTiers = tierAttr ? JSON.parse(tierAttr.value) : {}

    return {
      ...appDataPlugin.data,
      name: asset.name,
      uri: asset.uri,
      owner: asset.owner.toString(),
      pass: asset.publicKey.toString(),
      metadata,
      rewardTiers,
    }
  } catch (error) {
    // Return null if the asset is not found
    if (error instanceof Error && error.message.includes('not found')) {
      return null
    }
    // For other errors, throw them
    throw new Error(`Failed to fetch asset data: ${error}`)
  }
}
