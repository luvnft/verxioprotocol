import { MongoClient, Db } from 'mongodb';
import { 
  DatabaseAdapter, 
  DatabaseConfig, 
  StoredLoyaltyPass, 
  TransferRequest 
} from '../types';

export class MongoDBAdapter implements DatabaseAdapter {
  private client: MongoClient;
  private db: Db | null = null;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
    this.client = new MongoClient(config.uri, config.options);
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db();
    } catch (error) {
      throw new Error(`MongoDB connection failed: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  async createInventory(userId: string, data: any): Promise<any> {
    if (!this.db) throw new Error('Database not connected');
    
    const inventory = {
      userId,
      nfts: [],
      createdAt: new Date(),
      ...data
    };

    const result = await this.db.collection('inventories').insertOne(inventory);
    return { ...inventory, _id: result.insertedId };
  }

  async addNFTToInventory(userId: string, nftData: any): Promise<any> {
    if (!this.db) throw new Error('Database not connected');

    const result = await this.db.collection('inventories').updateOne(
      { userId },
      { $push: { nfts: nftData } }
    );

    return result.modifiedCount > 0;
  }

  async removeNFTFromInventory(userId: string, nftId: string): Promise<boolean> {
    if (!this.db) throw new Error('Database not connected');

    const result = await this.db.collection('inventories').updateOne(
      { userId },
      { $pull: { nfts: { nftId: nftId } } } as any
    );

    return result.modifiedCount > 0;
  }

  async getInventory(userId: string): Promise<any> {
    if (!this.db) throw new Error('Database not connected');

    return this.db.collection('inventories').findOne({ userId });
  }

  async getInventoryByWallet(walletAddress: string): Promise<any> {
    if (!this.db) throw new Error('Database not connected');
    
    return this.db.collection('inventories').findOne({ walletAddress });
  }

  async createProgram(data: any): Promise<void> {
    if (!this.db) throw new Error('Database not connected');
    
    await this.db.collection('programs').insertOne(data);
  }

  async getProgram(programId: string): Promise<any | null> {
    if (!this.db) throw new Error('Database not connected');
    
    return this.db.collection('programs').findOne({ programId });
  }

  async createLoyaltyPass(data: StoredLoyaltyPass): Promise<void> {
    if (!this.db) throw new Error('Database not connected');
    await this.db.collection('loyalty_passes').insertOne(data);
  }

  async getLoyaltyPass(passId: string): Promise<StoredLoyaltyPass | null> {
    if (!this.db) throw new Error('Database not connected');
    const doc = await this.db.collection('loyalty_passes').findOne({ passId });
    return doc as StoredLoyaltyPass | null;
  }

  async createTransferRequest(data: TransferRequest): Promise<void> {
    if (!this.db) throw new Error('Database not connected');
    await this.db.collection('transfer_requests').insertOne(data);
  }

  async getTransferRequest(passId: string): Promise<TransferRequest | null> {
    if (!this.db) throw new Error('Database not connected');
    const doc = await this.db.collection('transfer_requests').findOne({ passId });
    return doc as TransferRequest | null;
  }

  async updateTransferRequest(passId: string, update: Partial<TransferRequest>): Promise<void> {
    if (!this.db) throw new Error('Database not connected');
    await this.db.collection('transfer_requests').updateOne(
      { passId },
      { $set: update }
    );
  }

  async updateLoyaltyPass(passId: string, update: Partial<StoredLoyaltyPass>): Promise<void> {
    if (!this.db) throw new Error('Database not connected');
    await this.db.collection('loyalty_passes').updateOne(
      { passId },
      { $set: update }
    );
  }
} 