'use client'

interface TierProgressionProps {
  currentXP: number
  currentTier: string
  tiers: Array<{
    name: string
    xpRequired: number
    rewards: string[]
  }>
}

export function TierProgression({ currentXP, currentTier, tiers }: TierProgressionProps) {
  const sortedTiers = [...tiers].sort((a, b) => a.xpRequired - b.xpRequired)
  const currentTierIndex = sortedTiers.findIndex((tier) => tier.name === currentTier)
  const nextTier = sortedTiers[currentTierIndex + 1]

  // Calculate progress percentage
  const progress = nextTier
    ? ((currentXP - sortedTiers[currentTierIndex].xpRequired) /
        (nextTier.xpRequired - sortedTiers[currentTierIndex].xpRequired)) *
      100
    : 100

  // Calculate the remaining XP needed for next tier
  const xpNeeded = nextTier ? nextTier.xpRequired - currentXP : 0

  return (
    <div className="bg-white rounded-lg border border-zinc-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-zinc-900">Tier Progress</h2>
        <p className="text-sm text-zinc-600 mt-1">Your journey through the tiers</p>
      </div>

      {/* Progress Bar */}
      {nextTier && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-zinc-900">{currentTier}</span>
            <span className="font-medium text-zinc-900">{nextTier.name}</span>
          </div>
          <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <div className="mt-2 text-center">
            <span className="text-sm text-zinc-600">{xpNeeded} XP needed for next tier</span>
          </div>
        </div>
      )}

      {/* Tier List */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {sortedTiers.map((tier, index) => {
          const isActive = currentTier === tier.name
          const isCompleted = index < currentTierIndex

          return (
            <div
              key={tier.name}
              className={`relative p-4 rounded-lg border transition-all ${
                isActive
                  ? 'border-blue-200 bg-blue-50 shadow-sm'
                  : isCompleted
                    ? 'border-green-200 bg-green-50'
                    : 'border-zinc-200 bg-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive
                      ? 'bg-blue-100 text-blue-600'
                      : isCompleted
                        ? 'bg-green-100 text-green-600'
                        : 'bg-zinc-100 text-zinc-400'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm font-medium ${
                        isActive ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-zinc-900'
                      }`}
                    >
                      {tier.name}
                    </p>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white border border-zinc-200">
                      {tier.xpRequired} XP
                    </span>
                  </div>
                  {tier.rewards.length > 0 && (
                    <p className="mt-1 text-xs text-zinc-600 truncate">Rewards: {tier.rewards.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
