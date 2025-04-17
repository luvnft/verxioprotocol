'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Raffle } from '@/types/raffle'
import { useWallet } from '@solana/wallet-adapter-react'
import { formatDistanceToNow } from 'date-fns'

export default function RaffleDetailsPage() {
  const { id } = useParams()
  const [raffle, setRaffle] = useState<Raffle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { publicKey } = useWallet()

  useEffect(() => {
    async function fetchRaffle() {
      try {
        const response = await fetch(`/api/raffles/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch raffle')
        }
        const data = await response.json()
        setRaffle(data)
      } catch (error) {
        toast.error('Failed to fetch raffle details')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchRaffle()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-verxio-purple"></div>
      </div>
    )
  }

  if (!raffle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="bg-black/20 backdrop-blur-sm border-slate-800/20">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-semibold text-white orbitron mb-2">Raffle Not Found</h2>
            <p className="text-white/70 text-center max-w-md">
              The raffle you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isCreator = publicKey?.toString() === raffle.creator

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="bg-black/20 backdrop-blur-sm border-slate-800/20 mb-8">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white orbitron mb-2">{raffle.name}</h1>
              <p className="text-white/70">{raffle.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  raffle.status === 'UPCOMING'
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : raffle.status === 'ACTIVE'
                      ? 'bg-green-500/20 text-green-500'
                      : raffle.status === 'COMPLETED'
                        ? 'bg-blue-500/20 text-blue-500'
                        : 'bg-red-500/20 text-red-500'
                }`}
              >
                {raffle.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white orbitron mb-2">Prize Details</h3>
              <div className="space-y-2">
                <p className="text-white/70">
                  <span className="text-white">Type:</span> {raffle.prizeType}
                </p>
                {raffle.prizeType === 'TOKEN' && (
                  <>
                    <p className="text-white/70">
                      <span className="text-white">Amount:</span> {raffle.prizeDetails.token?.amount}
                    </p>
                    <p className="text-white/70">
                      <span className="text-white">Mint:</span> {raffle.prizeDetails.token?.mint}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white orbitron mb-2">Raffle Details</h3>
              <div className="space-y-2">
                <p className="text-white/70">
                  <span className="text-white">Start Date:</span> {new Date(raffle.startDate).toLocaleDateString()}
                </p>
                <p className="text-white/70">
                  <span className="text-white">End Date:</span> {new Date(raffle.endDate).toLocaleDateString()}
                </p>
                <p className="text-white/70">
                  <span className="text-white">Draw Date:</span> {new Date(raffle.drawDate).toLocaleDateString()}
                </p>
                <p className="text-white/70">
                  <span className="text-white">Entry Cost:</span> {raffle.entryCost ? `${raffle.entryCost} XP` : 'Free'}
                </p>
                <p className="text-white/70">
                  <span className="text-white">Number of Winners:</span> {raffle.numWinners}
                </p>
              </div>
            </div>
          </div>

          {raffle.status === 'COMPLETED' && raffle.winners && raffle.winners.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white orbitron mb-4">Winners</h3>
              <div className="space-y-4">
                {raffle.winners.map((winner) => (
                  <Card key={winner.id} className="bg-black/20 backdrop-blur-sm border-slate-800/20">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white/70">
                            <span className="text-white">Position:</span> {winner.position}
                          </p>
                          <p className="text-white/70">
                            <span className="text-white">Pass:</span> {winner.passPublicKey}
                          </p>
                          <p className="text-white/70">
                            <span className="text-white">Status:</span> {winner.claimed ? 'Claimed' : 'Not Claimed'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {raffle.status === 'UPCOMING' && (
            <div className="text-center py-8">
              <p className="text-white/70">
                Raffle starts {formatDistanceToNow(new Date(raffle.startDate), { addSuffix: true })}
              </p>
            </div>
          )}

          {raffle.status === 'ACTIVE' && (
            <div className="text-center py-8">
              <p className="text-white/70">
                Raffle ends {formatDistanceToNow(new Date(raffle.endDate), { addSuffix: true })}
              </p>
              {isCreator && (
                <Button
                  className="mt-4 bg-gradient-to-r from-[#00FFE0] via-[#0085FF] to-[#7000FF] text-white hover:opacity-90 orbitron"
                  asChild
                >
                  <a href={`/dashboard/raffle/${raffle.id}/draw`}>Draw Winners</a>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
