import dynamic from 'next/dynamic'
import '@solana/wallet-adapter-react-ui/styles.css'

export const WalletButton = dynamic(async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton, {
  ssr: false,
})

export const WalletDisconnectButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletDisconnectButton,
  {
    ssr: false,
  },
)
