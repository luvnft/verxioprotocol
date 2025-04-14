import { VerxioContext } from '@schemas/verxio-context'
import { KeypairSigner, PublicKey } from '@metaplex-foundation/umi'
import { fetchAsset } from '@metaplex-foundation/mpl-core'
import { getCollectionAttribute, calculateNewTier, updatePassData } from './index'
import { ATTRIBUTE_KEYS } from './constants'
import { LoyaltyProgramTier } from '@schemas/loyalty-program-tier'

export interface GiftLoyaltyPointsConfig {
  passAddress: PublicKey
  pointsToGift: number
  signer: KeypairSigner
  action: string
}

export async function giftLoyaltyPoints(
  context: VerxioContext,
  config: GiftLoyaltyPointsConfig,
): Promise<{
  points: number
  signature: string
  newTier: LoyaltyProgramTier
}> {
  assertValidGiftLoyaltyPointsConfig(config)
  try {
    // Fetch the asset data
    const asset = await fetchAsset(context.umi, config.passAddress)
    if (!asset) {
      throw new Error('Failed to gift points: Pass not found')
    }

    // Get the collection attribute to verify ownership
    const collectionAttribute = getCollectionAttribute(context, ATTRIBUTE_KEYS.TYPE)
    if (!collectionAttribute) {
      throw new Error('Pass does not belong to a collection')
    }

    // Get the current pass data
    const appDataPlugin = asset.appDatas?.[0]
    if (!appDataPlugin) {
      throw new Error('AppData plugin not found')
    }
    const currentData = appDataPlugin.data || {}
    const currentPoints = currentData.xp || 0

    // Calculate new points
    const newPoints = currentPoints + config.pointsToGift

    // Calculate new tier based on updated points
    const newTier = await calculateNewTier(context, newPoints)

    // Update the pass data on-chain
    const result = await updatePassData(context, config.passAddress, config.signer, appDataPlugin, {
      xp: newPoints,
      action: config.action,
      points: config.pointsToGift,
      currentData,
      newTier,
    })

    return {
      points: newPoints,
      signature: result.signature,
      newTier,
    }
  } catch (error) {
    // If it's already an Error object, rethrow it
    if (error instanceof Error) {
      throw error
    }
    // Otherwise wrap it in a new Error
    throw new Error(`Failed to gift points: ${error}`)
  }
}

// TODO: Replace with zod validation
function assertValidGiftLoyaltyPointsConfig(config: GiftLoyaltyPointsConfig) {
  if (!config) {
    throw new Error('assertValidGiftLoyaltyPointsConfig: Config is undefined')
  }
  if (!config.passAddress) {
    throw new Error('assertValidGiftLoyaltyPointsConfig: Pass address is undefined')
  }
  if (typeof config.pointsToGift !== 'number' || config.pointsToGift <= 0) {
    throw new Error('assertValidGiftLoyaltyPointsConfig: Points to gift must be a positive number')
  }
  if (!config.signer) {
    throw new Error('assertValidGiftLoyaltyPointsConfig: Signer is undefined')
  }
  if (!config.action) {
    throw new Error('assertValidGiftLoyaltyPointsConfig: Action is undefined')
  }
}
