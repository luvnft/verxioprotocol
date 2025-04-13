'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { WalletButton } from './buttonConfig'

const Header = () => {
  const { connected } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (connected) {
      router.push('/dashboard')
    }
  }, [connected, router])

  //
  return (
    <header className="fixed top-0 right-0 z-50 p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-4 bg-black/20 backdrop-blur-sm rounded-lg p-2">
        {/* Wallet Button */}
        <WalletButton style={{ fontFamily: 'orbitron' }} />
      </div>
    </header>
  )
}

export default Header
