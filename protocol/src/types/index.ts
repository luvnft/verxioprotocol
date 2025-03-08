import { PublicKey } from '@solana/web3.js';

export type Network = 'mainnet' | 'devnet' | 'sonic-mainnet' | 'sonic-testnet';

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


