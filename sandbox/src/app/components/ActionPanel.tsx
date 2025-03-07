'use client';

import { PublicKey } from '@solana/web3.js';
import { generateSigner } from '@metaplex-foundation/umi';
import { useEffect, useState } from 'react';
import { VerxioProtocol } from '../../../../protocol/src/core/index';
import { TierProgression } from './TierProgression';
import { EXPLORER_URLS } from './LoyaltyProgram';
import { NetworkOption } from './LoyaltyProgram';

interface ActionPanelProps {
  verxio: VerxioProtocol;
  passAddress: PublicKey;
  passSigner: ReturnType<typeof generateSigner>;
  network: NetworkOption;
}

export function ActionPanel({ verxio, passAddress, passSigner, network }: ActionPanelProps) {
  const [data, setData] = useState<{
    xp: number;
    lastAction: string | null;
    actionHistory: Array<{
      type: string;
      points: number;
      timestamp: number;
      newTotal: number;
      signature?: string;
    }>;
    currentTier: string;
    tierUpdatedAt: number;
    rewards: string[];
    actions: Record<string, number>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [programTiers, setProgramTiers] = useState<any[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const assetData = await verxio.getAssetData(passAddress);
      const programActions = await verxio.getPointsPerAction();
      const tiers = await verxio.getProgramTiers();
      setData(assetData ? { ...assetData, actions: programActions } : null);
      setProgramTiers(tiers);
    } catch (error) {
      console.error('Error loading pass data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [passAddress]);

  const getExplorerUrl = (signature: string) => {
    return EXPLORER_URLS[network].replace('{address}', signature);
  };

  const performAction = async (action: string) => {
    setLoadingAction(action);
    try {
      const result = await verxio.awardPoints(
        passAddress,
        action,
        passSigner
      );
      
      // Update the action history immediately with the signature
      if (data && data.actionHistory) {
        // Find the most recent action (which should be the one we just performed)
        const lastAction = data.actionHistory[data.actionHistory.length - 1];
        if (lastAction && lastAction.type === action) {
          lastAction.signature = result.signature;
        }
      }
      
      await loadData(); // Reload all data to get updated XP and other changes
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
    setLoadingAction(null);
  };

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
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
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
    );
  }

  // Find next tier (if any)
  const currentTierIndex = programTiers.findIndex(tier => tier.name === data.currentTier);
  const nextTier = programTiers[currentTierIndex + 1];
  const currentTierData = programTiers[currentTierIndex];
  
  // Calculate XP needed for next tier
  const xpForNextTier = nextTier ? nextTier.xpRequired - data.xp : 0;
  const progressPercentage = nextTier ? 
    ((data.xp - currentTierData.xpRequired) / (nextTier.xpRequired - currentTierData.xpRequired)) * 100 :
    100;

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="bg-white rounded-lg border border-zinc-200 p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">Your Progress</h2>
              <p className="text-sm text-zinc-600 mt-1">Current tier: {data.currentTier}</p>
            </div>
            <div className="text-right">
            <span className="text-4xl font-bold text-blue-600">{data.xp} XP</span>
              {nextTier && (
                <p className="text-sm text-zinc-600 mt-1">{xpForNextTier} XP until {nextTier.name}</p>
              )}
            </div>
          </div>

          {nextTier && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-zinc-600">
                <span>{data.currentTier}</span>
                <span>{nextTier.name}</span>
              </div>
              <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
                />
              </div>
            </div>
          )}
        </div>
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
                    <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
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
                  {action.signature && (
                    <a
                      href={getExplorerUrl(action.signature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1 inline-flex items-center"
                    >
                      View transaction
                      <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </a>
                  )}
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  +{action.points} XP
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}