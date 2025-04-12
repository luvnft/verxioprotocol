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
  metadata: {
    hostName: string
    brandColor?: string
    [key: string]: any
  }
  tiers: Tier[]
  pointsPerAction: Record<string, number>
}

export const createNewLoyaltyProgram = async (context: VerxioContext, params: CreateLoyaltyProgramParams) => {
  try {
    console.log('Creating loyalty program with params:', {
      ...params,
      programAuthority: context.programAuthority.toString(),
    })

    const result = await createLoyaltyProgramCore(context, {
      ...params,
      programAuthority: context.programAuthority,
    })

    console.log('Loyalty program created successfully:', {
      collection: result.collection.publicKey.toString(),
      signature: result.signature,
    })

    return result
  } catch (error) {
    console.error('Error creating loyalty program:', error)
    throw error
  }
}
