import { VerxioContext } from '@/types/verxio-context'
import { LoyaltyProgramTier } from '@/types/loyalty-program-tier'
import { validateCollectionState } from '@/utils/validate-collection-state'
import { ATTRIBUTE_KEYS } from './constants'
import { getCollectionAttribute } from './index'

export async function getProgramTiers(context: VerxioContext): Promise<LoyaltyProgramTier[]> {
  validateCollectionState(context)

  try {
    return (await getCollectionAttribute(context, ATTRIBUTE_KEYS.TIERS)) || []
  } catch (error) {
    throw new Error(`Failed to fetch program tiers: ${error}`)
  }
}
