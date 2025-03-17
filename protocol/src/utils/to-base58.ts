import { base58 } from '@metaplex-foundation/umi/serializers'
import { TransactionSignature } from '@metaplex-foundation/umi'

export function toBase58(buffer: Buffer | TransactionSignature): string {
  return base58.deserialize(buffer)[0]
}
