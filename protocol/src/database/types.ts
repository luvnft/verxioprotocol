import { Tier, PointsPerActionMap } from '../types';

export interface StoredProgram {
  programId: string;
  organizationName: string;
  createdAt: Date;
  tiers: Tier[];
  pointsPerAction: PointsPerActionMap;
  metadata: {
    uri: string;
    symbol?: string;
  };
  collectionPrivateKey: string;
}

export interface StoredLoyaltyPass {
  passId: string;
  programId: string;
  owner: string;
  issuedAt: Date;
  xp: number;
  metadata: {
    name: string;
    uri: string;
  };
}

export interface TransferRequest {
  passId: string;
  fromAddress: string;
  toAddress: string;
  requestedAt: Date;
  status: 'pending' | 'completed' | 'rejected';
  completedAt?: Date;
}

export interface DatabaseAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  createInventory(userId: string, data: any): Promise<any>;
  addNFTToInventory(userId: string, nftData: any): Promise<any>;
  removeNFTFromInventory(userId: string, nftId: string): Promise<boolean>;
  getInventory(userId: string): Promise<any>;
  getInventoryByWallet(walletAddress: string): Promise<any>;
  createProgram(data: StoredProgram): Promise<void>;
  getProgram(address: string): Promise<StoredProgram | null>;
  createLoyaltyPass(data: StoredLoyaltyPass): Promise<void>;
  getLoyaltyPass(passId: string): Promise<StoredLoyaltyPass | null>;
  createTransferRequest(data: TransferRequest): Promise<void>;
  getTransferRequest(passId: string): Promise<TransferRequest | null>;
  updateTransferRequest(passId: string, update: Partial<TransferRequest>): Promise<void>;
  updateLoyaltyPass(passId: string, update: Partial<StoredLoyaltyPass>): Promise<void>;
  // incrementProtocolStats(update: Partial<ProtocolStats>): Promise<void>;
  // getProtocolStats(): Promise<ProtocolStats>;
  // updateGlobalUserXP(userId: string, xpToAdd: number): Promise<number>;
  // getGlobalUserStats(userId: string): Promise<GlobalUserStats>;
  // getTopUsers(limit?: number): Promise<GlobalUserStats[]>;
}

export interface DatabaseConfig {
  uri: string;
  options?: Record<string, any>;
}
