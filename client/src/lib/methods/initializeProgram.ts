import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet } from '@solana/wallet-adapter-react'
import { VerxioContext } from '@verxioprotocol/core'
import { publicKey } from '@metaplex-foundation/umi'

export function useVerxioProgram() {
  const wallet = useWallet()

  if (!wallet.connected || !wallet.publicKey) {
    return null
  }

  const umi = createUmi('https://api.devnet.solana.com').use(walletAdapterIdentity(wallet))

  const context: VerxioContext = {
    umi,
    programAuthority: publicKey(wallet.publicKey.toString()),
    collectionAddress: undefined,
  }

  return context
}
