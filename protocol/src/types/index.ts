import { PublicKey } from '@solana/web3.js';
import { Umi, PublicKey as UmiPublicKey } from '@metaplex-foundation/umi';
import { DatabaseConfig } from '@/database/types';

export type Network = 'mainnet' | 'devnet' | 'sonic-mainnet' | 'sonic-testnet';

export interface VerxioConfig {
  network: Network;
  rpcUrl?: string; // Optional custom RPC URL
  programAuthority: PublicKey;
  organizationName: string;
  passMetadataUri: string;
  database?: {  // Make database optional
    type: 'mongodb' | 'supabase' | 'firebase';
    config: DatabaseConfig;
  };
  umi?: Umi;  // Make it optional since it might not always be provided
}

export interface Tier {
  name: string;
  xpRequired: number;
  rewards: string[];
}

export interface PointsPerActionMap {
  [key: string]: number;
}

// Program data interface for creation
export interface LoyaltyProgramData {
  organizationName: string;
  metadataUri: string;
  tiers: Array<{
    name: string;
    xpRequired: number;
    rewards: string[];
  }>;
  pointsPerAction: Record<string, number>;
  network: Network;
  programAuthority: PublicKey;
  rpcUrl?: string;
}


