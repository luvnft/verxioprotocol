'use client';

interface TierProgressionProps {
  currentXP: number;
  currentTier: string;
  tiers: Array<{
    name: string;
    xpRequired: number;
    rewards: string[];
  }>;
}

export function TierProgression({ currentXP, currentTier, tiers }: TierProgressionProps) {
  const sortedTiers = [...tiers].sort((a, b) => a.xpRequired - b.xpRequired);
  const currentTierIndex = sortedTiers.findIndex((tier) => tier.name === currentTier);
  const nextTier = sortedTiers[currentTierIndex + 1];
  
  // Calculate progress percentage
  const progress = nextTier
    ? ((currentXP - sortedTiers[currentTierIndex].xpRequired) /
       (nextTier.xpRequired - sortedTiers[currentTierIndex].xpRequired)) * 100
    : 100;
  
  // Calculate the remaining XP needed for next tier
  const xpNeeded = nextTier ? nextTier.xpRequired - currentXP : 0;
  
  // Get rewards of current tier
  const currentRewards = sortedTiers[currentTierIndex]?.rewards || [];

  return (
    <div className="bg-white rounded-lg border border-zinc-200 p-6">
      <h2 className="text-lg font-semibold text-zinc-900 mb-6">Tier Progress</h2>
      
      {/* Tier Path */}
      <div className="space-y-4">
        {sortedTiers.map((tier, index) => {
          const isActive = currentTier === tier.name;
          const isCompleted = index < currentTierIndex;
          
          return (
            <div
              key={tier.name}
              className={`p-4 rounded-lg border ${
                isActive 
                  ? 'border-blue-200 bg-blue-50' 
                  : isCompleted 
                    ? 'border-zinc-200 bg-zinc-50' 
                    : 'border-zinc-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-zinc-900">{tier.name}</h3>
                    <span className="text-sm text-zinc-600">{tier.xpRequired} XP</span>
                  </div>
                  <p className="text-sm text-zinc-600">
                    {tier.rewards.join(', ')}
                  </p>
                </div>
                
                <div>
                  {isCompleted ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Achieved
                    </span>
                  ) : isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Current
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Message */}
      {nextTier && (
        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-600">
            {xpNeeded <= 10 
              ? "You're so close! Just a bit more to reach the next tier." 
              : `Keep going! Earn ${xpNeeded} more XP to reach ${nextTier.name}.`}
          </p>
        </div>
      )}
    </div>
  );
}