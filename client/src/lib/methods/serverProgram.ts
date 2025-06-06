import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { httpDownloader } from '@metaplex-foundation/umi-downloader-http'
import { publicKey } from '@metaplex-foundation/umi'
import { VerxioContext } from '@verxioprotocol/core'

const RPC_ENDPOINTS = {
  devnet: `https://devnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`,
  'mainnet-beta': `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`,
}

export type Network = 'devnet' | 'mainnet-beta'

export function createServerProgram(
  programAuthority: string,
  collectionAddress: string,
  network: Network = 'devnet',
): VerxioContext {
  const rpcEndpoint = RPC_ENDPOINTS[network]
  const umi = createUmi(rpcEndpoint).use(mplTokenMetadata()).use(httpDownloader())

  return {
    umi,
    programAuthority: publicKey(programAuthority),
    collectionAddress: publicKey(collectionAddress),
  }
}
