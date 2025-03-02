import { PublicKey } from '@solana/web3.js';
import { Umi, PublicKey as UmiPublicKey } from '@metaplex-foundation/umi';

export interface VerxioConfig {
  umi: Umi;
  programAuthority: PublicKey;
  organizationName: string;
  passMetadataUri: string;
}

export interface Tier {
  name: string;
  xpRequired: number;
  rewards: string[];
}

export interface PointAction {
  [key: string]: number;
}

export interface LoyaltyProgramData {
  organizationName: string;
  metadataUri: string;
  symbol?: string;
  tiers: Tier[];
  pointsPerAction: PointAction;
}

// Plugin types
export interface AttributePlugin {
  type: 'Attributes';
  attributeList: { key: string; value: string }[];
}

export interface AppDataPlugin {
  type: 'AppData';
  data: Record<string, unknown>;
}

export type VerxioPlugin = AttributePlugin | AppDataPlugin;

export interface PointsPerActionMap {
  [key: string]: number;
}

// Asset type with plugins
export type AssetWithPlugins = {
  plugins: VerxioPlugin[];
};

export interface RewardClaim {
  tier: string;
  reward: string;
  claimedAt: number;
  transactionId: string;
}

export interface RewardParams {
  amount: string;
  recipient: string;
  metadata?: Record<string, any>;
} 