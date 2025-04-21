import { issueNewLoyaltyPass } from '@/lib/methods/issueLoyaltyPass'
import { generateSigner } from '@metaplex-foundation/umi'
import bs58 from 'bs58'
import { toast } from 'sonner'
import { VerxioContext } from '@verxioprotocol/core'

export async function mintLoyaltyPass(
  context: VerxioContext,
  programId: string,
  programName: string,
  programUri: string,
  recipientAddress: string,
  network: string,
): Promise<{ signature: string; publicKey: string } | null> {
  try {
    const assetSigner = generateSigner(context.umi)
    const result = await issueNewLoyaltyPass(context, {
      collectionAddress: programId,
      recipient: recipientAddress,
      passName: programName,
      passMetadataUri: programUri,
      assetSigner,
    })

    // Store in database
    await fetch('/api/storeLoyaltyPass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        collection: programId,
        recipient: recipientAddress,
        publicKey: result.asset.publicKey.toString(),
        privateKey: bs58.encode(result.asset.secretKey),
        signature: result.signature,
        network,
      }),
    })

    return {
      signature: result.signature,
      publicKey: result.asset.publicKey.toString(),
    }
  } catch (error) {
    console.error('Error minting pass:', error)
    toast.error(error instanceof Error ? error.message : 'Failed to mint pass')
    return null
  }
}
