import { PublicKey as UmiPublicKey } from '@metaplex-foundation/umi'
import { transferV1 } from '@metaplex-foundation/mpl-core'
import { VerxioContext } from '@schemas/verxio-context'
import { validateCollectionState } from '@utils/validate-collection-state'
import { createFeeInstruction } from '@/utils/fee-structure'

export async function approveTransfer(
  context: VerxioContext,
  passAddress: UmiPublicKey,
  toAddress: UmiPublicKey,
): Promise<void> {
  validateCollectionState(context)

  try {
    const feeInstruction = createFeeInstruction(context.umi, context.umi.identity.publicKey, 'VERXIO_INTERACTION')
    const txnInstruction = transferV1(context.umi, {
      asset: passAddress,
      newOwner: toAddress,
      collection: context.collectionAddress!,
    }).add(feeInstruction)

    await txnInstruction.sendAndConfirm(context.umi, { confirm: { commitment: 'confirmed' } })
  } catch (error) {
    throw new Error(`Failed to approve transfer: ${error}`)
  }
}
