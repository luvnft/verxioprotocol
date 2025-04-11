import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import LoyaltyCard from '@/components/loyalty/LoyaltyCard'
import { getAssetData } from '@verxioprotocol/core'
import { useRouter } from 'next/navigation'
import { useVerxioProgram } from '@/lib/methods/initializeProgram'
import { publicKey } from '@metaplex-foundation/umi'

interface AssetData {
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
}

interface LoyaltyPass {
  programName: string
  owner: string
  pointsPerAction: Record<string, number>
  hostName: string
  brandColor: string
  loyaltyPassAddress: string
  qrCodeUrl: string
  totalEarnedPoints: number
  tier: string
  assetData?: AssetData
}

// Demo data for loyalty passes
const DEMO_LOYALTY_PASSES = Array.from({ length: 5 }, (_, i) => ({
  programName: `Program ${i + 1}`,
  owner: '7YarZW...',
  pointsPerAction: { purchase: 100, review: 50 },
  hostName: 'Demo Business',
  brandColor: '#9d4edd',
  loyaltyPassAddress: `Pass${i + 1}...`,
  qrCodeUrl: `https://verxio.io/pass/${i + 1}`,
  totalEarnedPoints: Math.floor(Math.random() * 1000),
}))

const CARDS_PER_PAGE = 4

// Function to determine the current tier based on total points
function getCurrentTier(totalPoints: number, tiers: { name: string; xpRequired: number }[]) {
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (totalPoints >= tiers[i].xpRequired) {
      return tiers[i]
    }
  }
  return tiers[0] // Default to the first tier if no match
}

// Example tiers
const TIERS = [
  {
    name: 'Bronze',
    xpRequired: 500,
    rewards: ['2% cashback'],
  },
  {
    name: 'Silver',
    xpRequired: 1000,
    rewards: ['5% cashback'],
  },
]

export default function MyLoyaltyPasses() {
  const router = useRouter()
  const context = useVerxioProgram()
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [loyaltyPasses, setLoyaltyPasses] = useState<LoyaltyPass[]>([])
  const totalPages = Math.ceil(loyaltyPasses.length / CARDS_PER_PAGE)

  // Calculate the cards to show on the current page
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE
  const endIndex = startIndex + CARDS_PER_PAGE
  const currentCards = loyaltyPasses.slice(startIndex, endIndex)

  useEffect(() => {
    async function fetchAssetData() {
      if (!context) return

      try {
        const assetAddress = '3jgh5WZutghR9HoKUeQmmaFppmZEE61SmJn8MGmwGqYH'
        const data = await getAssetData(context, publicKey(assetAddress))

        if (data) {
          const pass: LoyaltyPass = {
            programName: data.name,
            owner: data.owner,
            pointsPerAction: {}, // This will be fetched separately
            hostName: 'Verxio Protocol',
            brandColor: '#9d4edd',
            loyaltyPassAddress: assetAddress,
            qrCodeUrl: `/dashboard/${assetAddress}`,
            totalEarnedPoints: data.xp,
            tier: data.currentTier,
            assetData: data,
          }
          setLoyaltyPasses([pass])
        }
      } catch (error) {
        console.error('Error fetching asset data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssetData()
  }, [context])

  if (isLoading) {
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
    <div className="space-y-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white orbitron">My Loyalty Cards</h1>
      </div> */}

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 px-4 sm:px-6 lg:px-8">
            {currentCards.map((pass, index) => (
              <div
                key={index}
                className="flex justify-center cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => router.push(`/dashboard/${pass.loyaltyPassAddress}`)}
              >
                <div className="w-full max-w-[320px] mx-auto">
                  <LoyaltyCard
                    programName={pass.programName}
                    owner={pass.owner}
                    pointsPerAction={pass.pointsPerAction}
                    hostName={pass.hostName}
                    brandColor={pass.brandColor}
                    loyaltyPassAddress={pass.loyaltyPassAddress}
                    qrCodeUrl={pass.qrCodeUrl}
                    totalEarnedPoints={pass.totalEarnedPoints}
                    tier={pass.tier}
                    lastAction={pass.assetData?.lastAction}
                    rewards={pass.assetData?.rewards}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
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
