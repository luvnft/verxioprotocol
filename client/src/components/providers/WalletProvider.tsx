'use client'

import { createSolanaDevnet, createSolanaMainnet, createWalletUiConfig, WalletUi } from '@wallet-ui/react'
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'

const config = createWalletUiConfig({
  clusters: [createSolanaDevnet(), createSolanaMainnet()],
})

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <SolanaWalletProvider wallets={[new PhantomWalletAdapter()]} autoConnect>
        <WalletModalProvider>
          <WalletUi config={config}>{children}</WalletUi>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}
