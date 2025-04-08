import { createLoyaltyProgram as createLoyaltyProgramCore } from '@verxioprotocol/core'
import { VerxioContext } from '@verxioprotocol/core'

export interface Tier {
  name: string
  xpRequired: number
  rewards: string[]
}

export interface CreateLoyaltyProgramParams {
  organizationName: string
  metadataUri: string
  tiers: Tier[]
  pointsPerAction: Record<string, number>
}

export const createNewLoyaltyProgram = async (context: VerxioContext, params: CreateLoyaltyProgramParams) => {
  try {
    const result = await createLoyaltyProgramCore(context, {
      ...params,
      programAuthority: context.programAuthority,
    })

    return result
  } catch (error) {
    console.error('Error creating loyalty program:', error)
    throw error
  }
}
