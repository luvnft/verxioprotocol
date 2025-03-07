import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  query,
  where,
  getDocs,
  limit
} from 'firebase/firestore';
import { DatabaseAdapter, DatabaseConfig, StoredProgram, StoredLoyaltyPass, TransferRequest } from '../types';

export class FirebaseAdapter implements DatabaseAdapter {
  private app: FirebaseApp;
  private db: Firestore;
  private isConnected: boolean = false;

  constructor(config: DatabaseConfig) {
    this.app = initializeApp(config.options?.firebaseConfig || {});
    this.db = getFirestore(this.app);
  }

  async connect(): Promise<void> {
    try {
      // Test connection by trying to access a collection
      await getDoc(doc(this.db, 'inventories', 'test'));
      this.isConnected = true;
    } catch (error) {
      throw new Error(`Firebase connection failed: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
  }

  async createInventory(userId: string, data: any): Promise<any> {
    if (!this.isConnected) throw new Error('Database not connected');

    const inventory = {
      userId,
      nfts: [],
      createdAt: new Date(),
      ...data
    };

    const inventoryRef = doc(this.db, 'inventories', userId);
    await setDoc(inventoryRef, inventory);

    return inventory;
  }

  async addNFTToInventory(userId: string, nftData: any): Promise<any> {
    if (!this.isConnected) throw new Error('Database not connected');

    const inventoryRef = doc(this.db, 'inventories', userId);
    await updateDoc(inventoryRef, {
      nfts: arrayUnion(nftData)
    });

    return true;
  }

  async removeNFTFromInventory(userId: string, nftId: string): Promise<boolean> {
    if (!this.isConnected) throw new Error('Database not connected');

    const inventoryRef = doc(this.db, 'inventories', userId);
    const inventoryDoc = await getDoc(inventoryRef);
    
    if (!inventoryDoc.exists()) {
      throw new Error('Inventory not found');
    }

    const nftToRemove = inventoryDoc.data().nfts.find(
      (nft: any) => nft.nftId === nftId
    );

    if (nftToRemove) {
      await updateDoc(inventoryRef, {
        nfts: arrayRemove(nftToRemove)
      });
    }

    return true;
  }

  async getInventory(userId: string): Promise<any> {
    if (!this.isConnected) throw new Error('Database not connected');

    const inventoryRef = doc(this.db, 'inventories', userId);
    const inventoryDoc = await getDoc(inventoryRef);

    if (!inventoryDoc.exists()) {
      return null;
    }

    return inventoryDoc.data();
  }

  async getInventoryByWallet(walletAddress: string): Promise<any> {
    const q = query(
      collection(this.db, 'inventories'),
      where('walletAddress', '==', walletAddress),
      limit(1)
    );
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0].data();
  }

  async createProgram(data: StoredProgram): Promise<void> {
    if (!this.isConnected) throw new Error('Database not connected');
    await setDoc(doc(this.db, 'programs', data.programId), data);
  }

  async getProgram(programId: string): Promise<StoredProgram | null> {
    if (!this.isConnected) throw new Error('Database not connected');
    const docRef = doc(this.db, 'programs', programId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as StoredProgram : null;
  }

  async createLoyaltyPass(data: StoredLoyaltyPass): Promise<void> {
    if (!this.isConnected) throw new Error('Database not connected');
    await setDoc(doc(this.db, 'loyalty_passes', data.passId), data);
  }

  async getLoyaltyPass(passId: string): Promise<StoredLoyaltyPass | null> {
    if (!this.isConnected) throw new Error('Database not connected');
    const docRef = doc(this.db, 'loyalty_passes', passId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as StoredLoyaltyPass : null;
  }

  async createTransferRequest(data: TransferRequest): Promise<void> {
    if (!this.isConnected) throw new Error('Database not connected');
    await setDoc(doc(this.db, 'transfer_requests', data.passId), data);
  }

  async getTransferRequest(passId: string): Promise<TransferRequest | null> {
    if (!this.isConnected) throw new Error('Database not connected');
    const docRef = doc(this.db, 'transfer_requests', passId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as TransferRequest : null;
  }

  async updateTransferRequest(passId: string, update: Partial<TransferRequest>): Promise<void> {
    if (!this.isConnected) throw new Error('Database not connected');
    await updateDoc(doc(this.db, 'transfer_requests', passId), update);
  }

  async updateLoyaltyPass(passId: string, update: Partial<StoredLoyaltyPass>): Promise<void> {
    if (!this.isConnected) throw new Error('Database not connected');
    await updateDoc(doc(this.db, 'loyalty_passes', passId), update);
  }
} 