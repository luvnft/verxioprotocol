import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import LoyaltyCard from '@/components/loyalty/LoyaltyCard'
import { getAssetData } from '@verxioprotocol/core'
import { useRouter } from 'next/navigation'
import { useVerxioProgram } from '@/lib/methods/initializeProgram'
import { publicKey } from '@metaplex-foundation/umi'
import { useWallet } from '@solana/wallet-adapter-react'
import { getImageFromMetadata } from '@/lib/getImageFromMetadata'

export interface AssetData {
  xp: number
  lastAction: string | null
  actionHistory: Array<{
    type: string
    points: number
    timestamp: number
    newTotal: number
  }>
  currentTier: string
  tierUpdatedAt: number
  rewards: string[]
  name: string
  uri: string
  owner: string
  metadata: {
    organizationName: string
    brandColor?: string
    [key: string]: any
  }
  rewardTiers: Array<{
    name: string
    xpRequired: number
    rewards: string[]
  }>
}

interface LoyaltyPass {
  programName: string
  owner: string
  pointsPerAction: Record<string, number>
  organizationName: string
  brandColor: string
  loyaltyPassAddress: string
  qrCodeUrl: string
  totalEarnedPoints: number
  tier: string
  assetData?: AssetData
  bannerImage: string
}

export default function MyLoyaltyPasses() {
  const router = useRouter()
  const context = useVerxioProgram()
  const { publicKey: walletPublicKey } = useWallet()
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [loyaltyPasses, setLoyaltyPasses] = useState<LoyaltyPass[]>([])
  const mounted = useRef(true)
  const isFetching = useRef(false)

  // Calculate pagination
  const CARDS_PER_PAGE = 4
  const totalPages = Math.ceil(loyaltyPasses.length / CARDS_PER_PAGE)
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE
  const endIndex = startIndex + CARDS_PER_PAGE
  const currentCards = loyaltyPasses.slice(startIndex, endIndex)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    async function fetchPasses() {
      if (!context || !walletPublicKey || isFetching.current) return

      isFetching.current = true
      setIsLoading(true)

      try {
        // First fetch passes from database
        const response = await fetch(`/api/getLoyaltyPasses?recipient=${walletPublicKey.toString()}`)
        const dbPasses = await response.json()

        if (!dbPasses || dbPasses.length === 0) {
          if (mounted.current) {
            setLoyaltyPasses([])
            setIsLoading(false)
          }
          return
        }

        // Then fetch asset data for each pass
        const passesWithData = await Promise.all(
          dbPasses.map(async (pass: any) => {
            try {
              const data = await getAssetData(context, publicKey(pass.publicKey))
              if (data) {
                const bannerImage = await getImageFromMetadata(data.uri)
                return {
                  programName: data.name,
                  owner: data.owner,
                  pointsPerAction: {},
                  organizationName: data.metadata.organizationName,
                  brandColor: data.metadata.brandColor || '#6F2FF0',
                  loyaltyPassAddress: pass.publicKey,
                  qrCodeUrl: `${window.location.origin}/dashboard/${pass.publicKey}`,
                  totalEarnedPoints: data.xp,
                  tier: data.currentTier,
                  assetData: data,
                  bannerImage,
                }
              }
            } catch (err) {
              console.error(`Error fetching data for pass ${pass.publicKey}:`, err)
            }
            return null
          }),
        )

        if (mounted.current) {
          setLoyaltyPasses(passesWithData.filter((pass): pass is NonNullable<typeof pass> => pass !== null))
        }
      } catch (error) {
        console.error('Error fetching passes:', error)
      } finally {
        if (mounted.current) {
          setIsLoading(false)
        }
        isFetching.current = false
      }
    }

    fetchPasses()
  }, [context, walletPublicKey])

  // Only show loading state if we're actually loading and have no data
  if (isLoading && loyaltyPasses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-verxio-purple mx-auto" />
          <p className="text-white/70 orbitron">Loading your loyalty cards...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      {currentCards.length === 0 ? (
        <Card className="bg-black/20 backdrop-blur-sm border-slate-800/20">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <Loader2 className="w-12 h-12 text-[#00FFE0]" />
            </div>
            <h2 className="text-xl font-semibold text-white orbitron mb-2">No Loyalty Cards</h2>
            <p className="text-white/70 text-center max-w-md">
              You don't have any loyalty cards yet. Join a loyalty program to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-16">
            {currentCards.map((pass, index) => (
              <div
                key={index}
                className="flex justify-center cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => router.push(`/dashboard/${pass.loyaltyPassAddress}`)}
              >
                <div className="w-full max-w-[400px]">
                  <LoyaltyCard
                    programName={pass.programName}
                    owner={pass.owner}
                    pointsPerAction={pass.pointsPerAction}
                    organizationName={pass.organizationName}
                    brandColor={pass.brandColor}
                    loyaltyPassAddress={pass.loyaltyPassAddress}
                    qrCodeUrl={pass.qrCodeUrl}
                    totalEarnedPoints={pass.totalEarnedPoints}
                    tier={pass.tier}
                    lastAction={pass.assetData?.lastAction}
                    rewards={pass.assetData?.rewards}
                    bannerImage={pass.bannerImage}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                className="bg-black/20 border border-verxio-purple/20 text-white px-4 py-2 rounded-lg hover:bg-black/30 transition-colors"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-white/70 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="bg-black/20 border border-verxio-purple/20 text-white px-4 py-2 rounded-lg hover:bg-black/30 transition-colors"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
