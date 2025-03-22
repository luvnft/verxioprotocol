import { KeypairSigner, PublicKey as UmiPublicKey } from '@metaplex-foundation/umi'
import { fetchAsset } from '@metaplex-foundation/mpl-core'
import { VerxioContext } from '@/types/verxio-context'
import { ATTRIBUTE_KEYS, DEFAULT_PASS_DATA } from '@/lib/constants'
import { getCollectionAttribute, calculateNewTier, updatePassData } from './index'

export interface AwardLoyaltyPointsConfig {
  passAddress: UmiPublicKey
  action: string
  signer: KeypairSigner
  multiplier?: number
}

export async function awardLoyaltyPoints(
  context: VerxioContext,
  config: AwardLoyaltyPointsConfig,
): Promise<{ points: number; signature: string }> {
  try {
    const asset = await fetchAsset(context.umi, config.passAddress)
    const appDataPlugin = asset.appDatas?.[0]

    if (!appDataPlugin) {
      throw new Error('AppData plugin not found')
    }

    const currentData = appDataPlugin.data || DEFAULT_PASS_DATA
    const currentXp = currentData.xp || 0

    const pointsPerAction = (await getCollectionAttribute(context, ATTRIBUTE_KEYS.POINTS_PER_ACTION)) || {}
    const points = (pointsPerAction[config.action] || 0) * (config.multiplier || 1)
    const newXp = currentXp + points

    const newTier = await calculateNewTier(context, newXp)

    return updatePassData(context, config.passAddress, config.signer, appDataPlugin, {
      xp: newXp,
      action: config.action,
      points,
      currentData,
      newTier,
    })
  } catch (error) {
    throw new Error(`Failed to award points: ${error}`)
  }
}
