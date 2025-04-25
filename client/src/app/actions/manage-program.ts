'use server'

import { createSignerFromKeypair, generateSigner, keypairIdentity } from '@metaplex-foundation/umi'
import { issueNewLoyaltyPass } from '@/lib/methods/issueLoyaltyPass'
import { awardPoints, revokePoints, giftPoints } from '@/lib/methods/manageLoyaltyPoints'
import { convertSecretKeyToKeypair } from '@/lib/utils'
import { getPassCollection, storeLoyaltyPass } from './loyalty'
import { getAssetSigner, getProgramSigner } from './signer'
import { cache } from 'react'
import bs58 from 'bs58'
import { createServerProgram, Network } from '@/lib/methods/serverProgram'

interface IssuePassInput {
  collectionAddress: string
  recipient: string
  passName: string
  passMetadataUri: string
  network: string
}

interface AwardPointsInput {
  passAddress: string
  action: string
  network: string
}

interface GiftPointsInput {
  passAddress: string
  pointsToGift: number
  action: string
  network: string
}

interface RevokePointsInput {
  passAddress: string
  pointsToRevoke: number
  network: string
}
const feePayer = '5GT8TtBWKqpLu11TszNBGudoJvxzyBgWGk7KGi2Bp7eMrxAk4bSn2UzY8NE4iKctRXnghV16XzWAn681qHhzvo4V'

export const issuePasses = cache(async (context: any, inputs: IssuePassInput[]) => {
  try {
    const results = await Promise.all(
      inputs.map(async (input) => {

        
        // Get the program's private key from the database
        const programSignerData = await getProgramSigner(input.collectionAddress)
        if (!programSignerData?.privateKey) {
          throw new Error('Program signer not found')
        }

        // Create a new server program context for this operation using the input's network
        const serverContext = createServerProgram(
          input.collectionAddress,
          input.collectionAddress,
          input.network as Network,
        )

        // Create the keypair signer from the private key
        const keypairSigner = createSignerFromKeypair(
          serverContext.umi,
          convertSecretKeyToKeypair(feePayer),
        )
        serverContext.umi.use(keypairIdentity(keypairSigner))

        // Generate signer using the server-side UMI
        const assetSigner = generateSigner(serverContext.umi)

        const result = await issueNewLoyaltyPass(serverContext, {
          collectionAddress: input.collectionAddress,
          recipient: input.recipient,
          passName: input.passName,
          passMetadataUri: input.passMetadataUri,
          assetSigner,
        })

        await storeLoyaltyPass({
          collection: input.collectionAddress,
          recipient: input.recipient,
          publicKey: result.asset.publicKey.toString(),
          privateKey: bs58.encode(result.asset.secretKey),
          signature: result.signature,
          network: input.network,
        })

        return {
          publicKey: result.asset.publicKey.toString(),
          signature: result.signature
        }
      }),
    )

    return results
  } catch (error) {
    console.error('Error issuing passes:', error)
    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred')
  }
})

export const awardPointsToPasses = cache(async (context: any, inputs: AwardPointsInput[]) => {
  try {
    const results = await Promise.all(
      inputs.map(async (input) => {
        const signerData = await getAssetSigner(input.passAddress)
        if (!signerData?.privateKey) {
          throw new Error('Signer record not found for this pass')
        }
        const collectionAddress = await getPassCollection(input.passAddress)
        console.log('Collection Address:', collectionAddress)
        const assetSigner = createSignerFromKeypair(context.umi, convertSecretKeyToKeypair(feePayer))
        context.collectionAddress = collectionAddress

        console.log('Context:', context)

        return await awardPoints(context, {
          passAddress: input.passAddress,
          action: input.action,
          signer: assetSigner,
        })
      }),
    )

    return results
  } catch (error) {
    console.error('Error awarding points:', error)
    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred')
  }
})

export const giftPointsToPasses = cache(async (context: any, inputs: GiftPointsInput[]) => {
  try {
    const results = await Promise.all(
      inputs.map(async (input) => {
        const signerData = await getAssetSigner(input.passAddress)
        if (!signerData?.privateKey) {
          throw new Error('Signer record not found for this pass')
        }

        const assetSigner = createSignerFromKeypair(context.umi, convertSecretKeyToKeypair(feePayer))
        context.collectionAddress = signerData.collection

        return await giftPoints(context, {
          passAddress: input.passAddress,
          pointsToGift: input.pointsToGift,
          signer: assetSigner,
          action: input.action,
        })
      }),
    )

    return results
  } catch (error) {
    console.error('Error gifting points:', error)
    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred')
  }
})

export const revokePointsFromPasses = cache(async (context: any, inputs: RevokePointsInput[]) => {
  try {
    const results = await Promise.all(
      inputs.map(async (input) => {
        const signerData = await getAssetSigner(input.passAddress)
        if (!signerData?.privateKey) {
          throw new Error('Signer record not found for this pass')
        }

        const assetSigner = createSignerFromKeypair(context.umi, convertSecretKeyToKeypair(feePayer))
        context.collectionAddress = signerData.collection

        return await revokePoints(context, {
          passAddress: input.passAddress,
          pointsToRevoke: input.pointsToRevoke,
          signer: assetSigner,
        })
      }),
    )

    return results
  } catch (error) {
    console.error('Error revoking points:', error)
    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred')
  }
})
