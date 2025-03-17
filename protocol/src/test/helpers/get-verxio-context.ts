import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { type PublicKey } from '@metaplex-foundation/umi'
import { initializeVerxio } from '@/lib'
import { VerxioContext } from '@/types/verxio-context'

export function getVerxioContext({ programAuthority }: { programAuthority: PublicKey }): VerxioContext {
  const umi = createUmi('https://api.devnet.solana.com')
  return initializeVerxio(umi, programAuthority)
}
