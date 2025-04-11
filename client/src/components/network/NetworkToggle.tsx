'use client'

import { useNetwork } from '@/lib/network-context'
import { Switch } from '@/components/ui/Switch'

export function NetworkToggle() {
  const { network, setNetwork } = useNetwork()

  const toggleNetwork = () => {
    setNetwork(network === 'devnet' ? 'mainnet-beta' : 'devnet')
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={network === 'mainnet-beta'}
        onCheckedChange={toggleNetwork}
        className="data-[state=checked]:bg-slate-700 data-[state=unchecked]:bg-slate-700 hover:data-[state=checked]:bg-slate-700/80 hover:data-[state=unchecked]:bg-slate-600"
      />
      <span className="bg-black/20 backdrop-blur-sm border-slate-800/20 text-white orbitron hover:bg-black/30 transition-colors px-3 py-1 rounded-lg">
        {network === 'devnet' ? 'Devnet' : 'Mainnet'}
      </span>
    </div>
  )
}
