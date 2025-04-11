'use client'

import { useNetwork } from '@/lib/network-context'
import { Network } from 'lucide-react'
import { Switch } from '@/components/ui/Switch'

export function NetworkToggle() {
  const { network, setNetwork } = useNetwork()

  return (
    <div className="flex items-center gap-2">
      <Network className="w-4 h-4 text-white/70" />
      <Switch
        checked={network === 'mainnet-beta'}
        onChange={() => setNetwork(network === 'devnet' ? 'mainnet-beta' : 'devnet')}
        className="bg-black/20 backdrop-blur-sm border-slate-800/20 text-white orbitron hover:bg-black/30 transition-colors"
      />
      <span className="text-white orbitron">{network === 'devnet' ? 'Devnet' : 'Mainnet'}</span>
    </div>
  )
}
