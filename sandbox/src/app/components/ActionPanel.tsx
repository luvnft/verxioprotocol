'use client'

import { PublicKey } from '@metaplex-foundation/umi'
import { KeypairSigner } from '@metaplex-foundation/umi'
import { useEffect, useState } from 'react'
import {
  VerxioContext,
  getAssetData,
  getPointsPerAction,
  getProgramTiers,
  awardLoyaltyPoints,
  revokeLoyaltyPoints,
} from '@verxioprotocol/core'
import { TierProgression } from './TierProgression'
import { NetworkOption } from './LoyaltyProgram'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface ActionPanelProps {
  verxio: VerxioContext
  passAddress: PublicKey
  passSigner: KeypairSigner
  network: NetworkOption
  targetAddress: PublicKey
}

export function ActionPanel({ verxio, passAddress, passSigner, network, targetAddress }: ActionPanelProps) {
  const [data, setData] = useState<{
    xp: number
    lastAction: string | null
    actionHistory: Array<{
      type: string
      points: number
      timestamp: number
      newTotal: number
      signature?: string
    }>
    currentTier: string
    tierUpdatedAt: number
    rewards: string[]
    actions: Record<string, number>
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [programTiers, setProgramTiers] = useState<any[]>([])
  const [pointsToReduce, setPointsToReduce] = useState<number>(0)

  const loadData = async () => {
    setLoading(true)
    try {
      const assetData = await getAssetData(verxio, passAddress)
      const programActions = await getPointsPerAction(verxio)
      const tiers = await getProgramTiers(verxio)
      setData(assetData ? { ...assetData, actions: programActions } : null)
      setProgramTiers(tiers)
    } catch (error) {
      console.error('Error loading pass data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [passAddress])

  const performAction = async (action: string) => {
    setLoadingAction(action)
    try {
      toast.info(`Awarding points via awardPoints() for ${action}`)

      const result = await awardLoyaltyPoints(verxio, passAddress, action, passSigner)

      // Update the action history immediately with the signature
      if (data && data.actionHistory) {
        // Find the most recent action (which should be the one we just performed)
        const lastAction = data.actionHistory[data.actionHistory.length - 1]
        if (lastAction && lastAction.type === action) {
          lastAction.signature = result.signature
        }
      }

      toast.success(`Successfully awarded points for ${action}`)
      await loadData() // Reload all data to get updated XP and other changes
    } catch (error) {
      console.error(`Error performing ${action}:`, error)
      toast.error(`Failed to award points for ${action}`)
    }
    setLoadingAction(null)
  }

  const reducePoints = async () => {
    setLoading(true)
    try {
      toast.info(`Reducing ${pointsToReduce} points via reducePoints() method`)

      const result = await revokeLoyaltyPoints(verxio, passAddress, pointsToReduce, passSigner)

      toast.success(`Successfully reduced ${pointsToReduce} points`)
      await loadData() // Reload data to show updated XP
    } catch (error) {
      console.error('Error reducing points:', error)
      toast.error('Failed to reduce points')
    }
    setLoading(false)
  }

  if (loading || !data) {
    return (
      <div className="glass-panel">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="icon-container">
            <svg
              className="animate-spin h-8 w-8 text-blue-600 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-lg">Loading pass information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress and Tiers Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Stats */}
        <div className="bg-white rounded-lg border border-zinc-200 p-6">
          <div className="flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-zinc-900">Your Progress</h2>
              <p className="text-sm text-zinc-600 mt-1">Track your loyalty journey</p>
            </div>

            <div className="flex-grow flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-32 h-32 rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center">
                <span className="text-4xl font-bold text-blue-600">{data.xp} XP</span>
              </div>
              <div>
                <p className="text-lg font-medium text-zinc-900">Current Tier</p>
                <p className="text-2xl font-semibold text-blue-600 mt-1">{data.currentTier}</p>
              </div>
              {data.rewards.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-zinc-700">Current Rewards</p>
                  <p className="text-sm text-zinc-600 mt-1">{data.rewards.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tier Progression */}
        <TierProgression currentXP={data.xp} currentTier={data.currentTier} tiers={programTiers} />
      </div>

      {/* Available Actions */}
      <div className="bg-white rounded-lg border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Available Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data.actions).map(([action, points]) => (
            <button
              key={action}
              onClick={() => performAction(action)}
              disabled={loadingAction === action}
              className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-lg 
                hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-zinc-900 capitalize">
                {loadingAction === action ? (
                  <div className="flex items-center space-x-2">
                    <svg
                      className="animate-spin h-4 w-4 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Processing...</span>
                  </div>
                ) : (
                  action
                )}
              </span>
              <span className="text-sm text-blue-600 font-medium">+{points} XP</span>
            </button>
          ))}
        </div>
      </div>

      {/* Point Reduction Section (Only visible to program authority) */}
      <div className="bg-white rounded-lg border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Revoke Loyalty Points</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={pointsToReduce}
              onChange={(e) => setPointsToReduce(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter points to reduce"
              min="0"
            />
            <button
              onClick={reducePoints}
              disabled={loading || pointsToReduce <= 0}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Reducing...</span>
                </div>
              ) : (
                'Revoke'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Action History */}
      <div className="bg-white rounded-lg border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Action History</h3>
        <div className="space-y-3">
          {data.actionHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-600">No actions performed yet</p>
            </div>
          ) : (
            data.actionHistory.map((action, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg border border-zinc-200"
              >
                <div>
                  <p className="text-zinc-900 font-medium capitalize">{action.type}</p>
                  <p className="text-sm text-zinc-600">
                    {new Date(action.timestamp).toLocaleDateString()} at{' '}
                    {new Date(action.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    action.type.toLowerCase() === 'revoke' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  {action.type.toLowerCase() === 'revoke' ? '' : '+'}
                  {action.points} XP
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
