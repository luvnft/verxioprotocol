import { VerxioContext } from '@/types/verxio-context'
import { KeypairSigner, PublicKey } from '@metaplex-foundation/umi'
import { fetchAsset } from '@metaplex-foundation/mpl-core'
import { getCollectionAttribute, calculateNewTier, updatePassData } from './index'
import { ATTRIBUTE_KEYS } from './constants'

export interface RevokeLoyaltyPointsConfig {
  passAddress: PublicKey
  pointsToRevoke: number
  signer: KeypairSigner
}

export async function revokeLoyaltyPoints(
  context: VerxioContext,
  config: RevokeLoyaltyPointsConfig,
): Promise<{
  points: number
  signature: string
}> {
  assertValidRevokeLoyaltyPointsConfig(config)
  try {
    // Fetch the asset data
    const asset = await fetchAsset(context.umi, config.passAddress)
    if (!asset) {
      throw new Error('Pass not found')
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
    const currentData = JSON.parse(new TextDecoder().decode(appDataPlugin.data))
    const currentPoints = currentData.xp || 0

    // Calculate new points (ensure we don't go below 0)
    const newPoints = Math.max(0, currentPoints - config.pointsToRevoke)

    // Calculate new tier based on updated points
    const newTier = calculateNewTier(context, newPoints)

    // Update the pass data
    const updatedData = {
      ...currentData,
      xp: newPoints,
      currentTier: newTier,
      tierUpdatedAt: Date.now(),
      actionHistory: [
        ...(currentData.actionHistory || []),
        {
          type: 'revoke',
          points: -config.pointsToRevoke,
          timestamp: Date.now(),
          newTotal: newPoints,
        },
      ],
    }

    // Update the pass data on-chain
    const result = await updatePassData(context, config.passAddress, config.signer, appDataPlugin, {
      xp: newPoints,
      action: 'revoke',
      points: -config.pointsToRevoke,
      currentData,
      newTier,
    })

    return {
      points: newPoints,
      signature: result.signature,
    }
  } catch (error) {
    throw new Error(`Failed to revoke points: ${error}`)
  }
}

// TODO: Replace with zod validation
function assertValidRevokeLoyaltyPointsConfig(config: RevokeLoyaltyPointsConfig) {
  if (!config) {
    throw new Error('assertValidRevokeLoyaltyPointsConfig: Config is undefined')
  }
  if (!config.passAddress) {
    throw new Error('assertValidRevokeLoyaltyPointsConfig: Pass address is undefined')
  }
  if (typeof config.pointsToRevoke !== 'number' || config.pointsToRevoke <= 0) {
    throw new Error('assertValidRevokeLoyaltyPointsConfig: Points to revoke must be a positive number')
  }
  if (!config.signer) {
    throw new Error('assertValidRevokeLoyaltyPointsConfig: Signer is undefined')
  }
}
