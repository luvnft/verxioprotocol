'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ArrowLeft, Star, Zap, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import LoyaltyCard from '@/components/loyalty/LoyaltyCard'

// Mock data for action history
const MOCK_ACTION_HISTORY = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  action: ['Purchase', 'Review', 'Referral', 'Social Share'][Math.floor(Math.random() * 4)],
  points: [50, 100, 200, 500][Math.floor(Math.random() * 4)],
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
}))

const ACTIONS_PER_PAGE = 5

interface PageProps {
  params: Promise<{ passId: string }>
}

export default function LoyaltyPassDetails({ params }: PageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [actionHistory, setActionHistory] = useState(MOCK_ACTION_HISTORY)
  const [passId, setPassId] = useState<string>('')

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params
      setPassId(resolvedParams.passId)
    }
    loadParams()
  }, [params])

  // Mock data for the loyalty pass
  const loyaltyPass = {
    programName: 'Premium Rewards Program',
    owner: '7YarZW...',
    pointsPerAction: {
      purchase: 100,
      review: 50,
      referral: 200,
      'social share': 150,
    },
    hostName: 'Demo Business',
    brandColor: '#9d4edd',
    loyaltyPassAddress: passId,
    qrCodeUrl: `https://verxio.io/pass/${passId}`,
    totalEarnedPoints: 1250,
    tier: 'Silver',
    tiers: [
      {
        name: 'Bronze',
        xpRequired: 500,
        rewards: ['2% cashback', 'Basic support'],
      },
      {
        name: 'Silver',
        xpRequired: 1000,
        rewards: ['5% cashback', 'Priority support', 'Early access'],
      },
      {
        name: 'Gold',
        xpRequired: 2000,
        rewards: ['10% cashback', 'VIP support', 'Exclusive events'],
      },
    ],
  }

  // Calculate pagination
  const totalPages = Math.ceil(actionHistory.length / ACTIONS_PER_PAGE)
  const startIndex = (currentPage - 1) * ACTIONS_PER_PAGE
  const endIndex = startIndex + ACTIONS_PER_PAGE
  const currentActions = actionHistory.slice(startIndex, endIndex)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-verxio-purple mx-auto" />
          <p className="text-white/70 orbitron">Loading loyalty pass details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" className="mb-6 text-white/70 hover:text-white" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Top Section - Tiers and Card */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 mb-8">
          {/* Tiers Section */}
          <Card className="bg-black/20 backdrop-blur-sm border-slate-800/20 shadow-lg shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="text-white orbitron">Reward Tiers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loyaltyPass.tiers.map((tier, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-black/40 border border-slate-800/20 hover:bg-black/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${loyaltyPass.brandColor}40, ${loyaltyPass.brandColor}20)`,
                            boxShadow: `0 0 15px ${loyaltyPass.brandColor}40`,
                          }}
                        >
                          <Star className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-white font-semibold">{tier.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/50 text-sm">Requires</span>
                        <span className="text-white font-semibold">{tier.xpRequired} XP</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {tier.rewards.map((reward, rewardIndex) => (
                        <div key={rewardIndex} className="flex items-center gap-2 text-white/90">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                          <span>{reward}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Loyalty Card */}
          <div className="flex justify-center">
            <div className="w-full max-w-[400px]">
              <LoyaltyCard
                programName={loyaltyPass.programName}
                owner={loyaltyPass.owner}
                pointsPerAction={loyaltyPass.pointsPerAction}
                hostName={loyaltyPass.hostName}
                brandColor={loyaltyPass.brandColor}
                loyaltyPassAddress={loyaltyPass.loyaltyPassAddress}
                qrCodeUrl={loyaltyPass.qrCodeUrl}
                totalEarnedPoints={loyaltyPass.totalEarnedPoints}
                tier={loyaltyPass.tier}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section - Points and History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Points per Action Section */}
          <Card className="bg-black/20 backdrop-blur-sm border-slate-800/20 shadow-lg shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="text-white orbitron">Points per Action</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {Object.entries(loyaltyPass.pointsPerAction).map(([action, points]) => (
                  <div
                    key={action}
                    className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-slate-800/20 hover:bg-black/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${loyaltyPass.brandColor}40, ${loyaltyPass.brandColor}20)`,
                          boxShadow: `0 0 15px ${loyaltyPass.brandColor}40`,
                        }}
                      >
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white/90 capitalize">{action}</span>
                    </div>
                    <span className="text-white font-semibold">{points} XP</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action History Section */}
          <Card className="bg-black/20 backdrop-blur-sm border-slate-800/20 shadow-lg shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="text-white orbitron">Action History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentActions.map((action) => (
                  <div
                    key={action.id}
                    className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-slate-800/20 hover:bg-black/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${loyaltyPass.brandColor}40, ${loyaltyPass.brandColor}20)`,
                          boxShadow: `0 0 15px ${loyaltyPass.brandColor}40`,
                        }}
                      >
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white/90 capitalize">{action.action}</p>
                        <p className="text-white/50 text-sm">{new Date(action.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-white font-semibold">+{action.points} XP</span>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="text-white/70 hover:text-white"
                    >
                      Previous
                    </Button>
                    <span className="text-white/70 text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="text-white/70 hover:text-white"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
