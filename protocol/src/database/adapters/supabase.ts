import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DatabaseAdapter, DatabaseConfig, StoredProgram, StoredLoyaltyPass, TransferRequest } from '../types';

export class SupabaseAdapter implements DatabaseAdapter {
  private client: SupabaseClient;
  private isConnected: boolean = false;

  constructor(config: DatabaseConfig) {
    this.client = createClient(config.uri, config.options?.apiKey as string);
  }

  async connect(): Promise<void> {
    try {
      const { data, error } = await this.client.from('inventories').select('*').limit(1);
      if (error) throw error;
      this.isConnected = true;
    } catch (error) {
      throw new Error(`Supabase connection failed: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
  }

  async createInventory(userId: string, data: any): Promise<any> {
    if (!this.isConnected) throw new Error('Database not connected');

    const inventory = {
      user_id: userId,
      nfts: [],
      created_at: new Date(),
      ...data
    };

    const { data: result, error } = await this.client
      .from('inventories')
      .insert(inventory)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async addNFTToInventory(userId: string, nftData: any): Promise<any> {
    if (!this.isConnected) throw new Error('Database not connected');

    const { data: inventory, error: fetchError } = await this.client
      .from('inventories')
      .select('nfts')
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    const updatedNfts = [...(inventory.nfts || []), nftData];

    const { error } = await this.client
      .from('inventories')
      .update({ nfts: updatedNfts })
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

  async removeNFTFromInventory(userId: string, nftId: string): Promise<boolean> {
    if (!this.isConnected) throw new Error('Database not connected');

    const { data: inventory, error: fetchError } = await this.client
      .from('inventories')
      .select('nfts')
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    const updatedNfts = (inventory.nfts || []).filter(
      (nft: any) => nft.nftId !== nftId
    );

    const { error } = await this.client
      .from('inventories')
      .update({ nfts: updatedNfts })
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

  async getInventory(userId: string): Promise<any> {
    if (!this.isConnected) throw new Error('Database not connected');

    const { data, error } = await this.client
      .from('inventories')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async getInventoryByWallet(walletAddress: string): Promise<any> {
    const { data, error } = await this.client
      .from('inventories')
      .select('*')
      .eq('walletAddress', walletAddress)
      .single();

    if (error) throw error;
    return data;
  }

  async createProgram(data: StoredProgram): Promise<void> {
    const { error } = await this.client
      .from('programs')
      .insert(data);
    if (error) throw error;
  }

  async getProgram(programId: string): Promise<StoredProgram | null> {
    const { data, error } = await this.client
      .from('programs')
      .select('*')
      .eq('programId', programId)
      .single();
    if (error) throw error;
    return data;
  }

  async createLoyaltyPass(data: StoredLoyaltyPass): Promise<void> {
    const { error } = await this.client
      .from('loyalty_passes')
      .insert(data);
    if (error) throw error;
  }

  async getLoyaltyPass(passId: string): Promise<StoredLoyaltyPass | null> {
    const { data, error } = await this.client
      .from('loyalty_passes')
      .select('*')
      .eq('passId', passId)
      .single();
    if (error) throw error;
    return data;
  }

  async createTransferRequest(data: TransferRequest): Promise<void> {
    const { error } = await this.client
      .from('transfer_requests')
      .insert(data);
    if (error) throw error;
  }

  async getTransferRequest(passId: string): Promise<TransferRequest | null> {
    const { data, error } = await this.client
      .from('transfer_requests')
      .select('*')
      .eq('passId', passId)
      .single();
    if (error) throw error;
    return data;
  }

  async updateTransferRequest(passId: string, update: Partial<TransferRequest>): Promise<void> {
    const { error } = await this.client
      .from('transfer_requests')
      .update(update)
      .eq('passId', passId);
    if (error) throw error;
  }

  async updateLoyaltyPass(passId: string, update: Partial<StoredLoyaltyPass>): Promise<void> {
    const { error } = await this.client
      .from('loyalty_passes')
      .update(update)
      .eq('passId', passId);
    if (error) throw error;
  }
} 