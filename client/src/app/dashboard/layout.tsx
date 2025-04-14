'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DashboardNav from '@/components/dashboard/DashboardNav'
import { DashboardProvider, useDashboard } from './DashboardContext'

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { connected } = useWallet()
  const router = useRouter()
  const { isOrganization } = useDashboard()

  useEffect(() => {
    if (!connected) {
      router.push('/')
    }
  }, [connected, router])

  if (!connected) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-64 flex-col gap-4 border-r border-verxio-purple/20 bg-black/20 p-4 fixed h-full">
        <DashboardNav isOrganization={isOrganization} />
      </div>
      <main className="flex-1 p-4 md:p-8 ml-64 overflow-y-auto">{children}</main>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardProvider>
  )
}
