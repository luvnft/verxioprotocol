'use client'

import { createSolanaDevnet, createSolanaMainnet, createWalletUiConfig, WalletUi } from '@wallet-ui/react'
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { useNetwork } from '@/lib/network-context'

const config = createWalletUiConfig({
  clusters: [createSolanaDevnet(), createSolanaMainnet()],
})

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  const { rpcEndpoint } = useNetwork()

  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()]

  return (
    <ConnectionProvider endpoint={rpcEndpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>
          <WalletUi config={config}>{children}</WalletUi>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}
