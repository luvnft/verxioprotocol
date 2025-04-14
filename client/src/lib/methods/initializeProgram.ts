import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createSignerFromWalletAdapter } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { VerxioContext } from '@verxioprotocol/core'
import { publicKey, Signer, signerIdentity } from '@metaplex-foundation/umi'
import { useWallet } from '@solana/wallet-adapter-react'
import { useNetwork } from '../network-context'

export function useVerxioProgram() {
  const { publicKey: walletPublicKey, wallet } = useWallet()
  const { rpcEndpoint } = useNetwork()

  // Early return if no wallet or public key
  if (!walletPublicKey || !wallet) {
    return null
  }

  // Create UMI instance
  const umi = createUmi(rpcEndpoint)

  // Convert the public key to UMI format
  const programAuthority = publicKey(walletPublicKey.toBase58())

  // Create signer from the active wallet adapter
  const signer = createSignerFromWalletAdapter(wallet.adapter)
  const umiWithSigner = umi.use(signerIdentity(signer))

  // Return the context
  const context: VerxioContext = {
    umi: umiWithSigner,
    programAuthority,
    collectionAddress: undefined,
  }

  return context
}
