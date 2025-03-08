import { PublicKey, Commitment, Connection } from "@solana/web3.js";
import { generateSigner, publicKey, Umi } from "@metaplex-foundation/umi";
import { 
  createCollection,  
  create, 
  fetchAsset,
  ExternalPluginAdapterSchema,
  PluginAuthority, 
  transferV1,
  writeData, 
  AssetV1,
  fetchCollection,
  fetchAssetsByOwner
} from "@metaplex-foundation/mpl-core";
import { 
  Network,
  LoyaltyProgramData
} from "../types";
import { PublicKey as UmiPublicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createSignerFromWalletAdapter } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { signerIdentity } from "@metaplex-foundation/umi";
import bs58 from "bs58";
import { WalletAdapter } from '@solana/wallet-adapter-base';

export class VerxioProtocol {
  private network: Network;
  private programAuthority: PublicKey;
  private collectionAddress: PublicKey | null = null;
  private collectionSigner: any = null;
  public umi!: Umi;
  private userWallet: WalletAdapter | null = null;

  private static DEFAULT_RPC_URLS: Record<Network, string> = {
    mainnet: "https://api.mainnet-beta.solana.com",
    devnet: "https://api.devnet.solana.com",
    "sonic-mainnet": "https://api.mainnet-alpha.sonic.game",
    "sonic-testnet": "https://api.testnet.sonic.game",
  };

  constructor(
    network: Network, 
    programAuthority: PublicKey, 
    userWallet?: WalletAdapter,
    rpcUrl?: string
  ) {
    this.network = network;
    this.programAuthority = programAuthority;
    this.userWallet = userWallet || null;

    const commitment: Commitment = 'processed';   
    const finalRpcUrl = rpcUrl || VerxioProtocol.DEFAULT_RPC_URLS[network];
    const connection = new Connection(finalRpcUrl, {
      commitment,
      wsEndpoint: finalRpcUrl
    });
    this.umi = createUmi(connection);

    // If user wallet is provided, set it as the fee payer
    if (userWallet) {
      const walletSigner = createSignerFromWalletAdapter(userWallet);
      this.umi.use(signerIdentity(walletSigner));
    }
  }

  // Convert Solana PublicKey to Umi PublicKey
  private toUmiPublicKey(key: PublicKey): UmiPublicKey {
    return publicKey(key.toBase58()) as UmiPublicKey;
  }

  //  Get network
  public getNetwork(): Network {
    return this.network;
  }

  // Add method to set collection address
  public setCollectionAddress(address: PublicKey): void {
    this.collectionAddress = address;
  }

  // Add method to set collection signer
  public setCollectionSigner(signer: any): void {
    this.collectionSigner = signer;
  }

  // Add method to update user wallet
  public setUserWallet(wallet: WalletAdapter) {
    this.userWallet = wallet;
    const walletSigner = createSignerFromWalletAdapter(wallet);
    this.umi.use(signerIdentity(walletSigner));
  }


  /**
   * Creates a new loyalty program with tiers and point actions
   */
  async createProgram(data: Omit<LoyaltyProgramData, 'network' | 'programAuthority' | 'rpcUrl'>): Promise<{
    programId: string;
    signature: string;
    collectionPrivateKey: string;
  }> {
    try {
      this.collectionSigner = generateSigner(this.umi);
      const collectionPublicKey = new PublicKey(
        this.collectionSigner.publicKey
      );

      const tx = await createCollection(this.umi, {
        name: data.organizationName,
        uri: data.metadataUri,
        collection: this.collectionSigner,
        plugins: [
          {
            type: "Attributes",
            attributeList: [
              { key: "programType", value: "loyalty" },
              { key: "tiers", value: JSON.stringify(data.tiers) },
              {
                key: "pointsPerAction",
                value: JSON.stringify(data.pointsPerAction),
              },
              {
                key: "creator",
                value: this.programAuthority.toString(),
              },
            ],
          },
          {
            type: "PermanentTransferDelegate",
            authority: { 
              type: "Address",
              address: this.toUmiPublicKey(this.programAuthority),
            } as PluginAuthority,
          },
        ],
      }).sendAndConfirm(this.umi);

      this.collectionAddress = collectionPublicKey;

      return {
        programId: this.collectionAddress.toString(),
        signature: bs58.encode(tx.signature),
        collectionPrivateKey: bs58.encode(this.collectionSigner.secretKey),
      };
    } catch (error) {
      throw new Error(`Failed to create loyalty program: ${error}`);
    }
  }

  /**
   * Issues a loyalty NFT pass to a user
   */
  async issueLoyaltyPass(
    recipient: PublicKey,
    passName: string,
    passMetadataUri: string
  ): Promise<{
    signer: ReturnType<typeof generateSigner>;
    signature: string;
  }> {
    if (!this.collectionAddress || !this.collectionSigner) {
      throw new Error("Collection not initialized. Call createProgram first.");
    }

    if (!this.userWallet) {
      throw new Error("User wallet not set. Call setUserWallet first.");
    }

    try {
      const assetSigner = generateSigner(this.umi);
      
      // Ensure the user's wallet is set as the fee payer
      const walletSigner = createSignerFromWalletAdapter(this.userWallet);
      this.umi.use(signerIdentity(walletSigner));
      
      const createTx = await create(this.umi, {
        asset: assetSigner,
        name: passName,
        uri: passMetadataUri,
        owner: this.toUmiPublicKey(recipient),
        collection: {
          publicKey: this.toUmiPublicKey(this.collectionAddress),
        },
        plugins: [
          {
            type: "AppData",
            dataAuthority: { 
              type: "Address",
              address: assetSigner.publicKey,
            },
            schema: ExternalPluginAdapterSchema.Json,
          },
          {
            type: "Attributes",
            attributeList: [
              { key: "type", value: "loyaltyPass" },
              { key: "xp", value: "0" },
            ],
          },
        ],
      }).sendAndConfirm(this.umi);

      console.log("Initializing loyalty pass data");

      await writeData(this.umi, {
        key: {
          type: "AppData",
          dataAuthority: {
            type: "Address",
            address: assetSigner.publicKey,
          },
        },
        authority: assetSigner,
        data: new TextEncoder().encode(
          JSON.stringify({
            xp: 0,
            lastAction: null,
            actionHistory: [],
            currentTier: "Grind",
            tierUpdatedAt: Date.now(),
            rewards: ["nothing for you!"],
          })
        ),
        asset: publicKey(assetSigner.publicKey),
        collection: this.toUmiPublicKey(this.collectionAddress!),
      }).sendAndConfirm(this.umi);

      return {
        signer: assetSigner,
        signature: bs58.encode(createTx.signature)
      };
    } catch (error) {
      throw new Error(`Failed to issue loyalty pass: ${error}`);
    }
  }

  /**
   * Awards points for an action
   */
  async awardPoints(
    passAddress: PublicKey, 
    action: string, 
    signer: ReturnType<typeof generateSigner>,
    multiplier: number = 1
  ): Promise<{ points: number; signature: string }> {
    if (!this.userWallet) {
      throw new Error("User wallet not set. Call setUserWallet first.");
    }

    try {
      const asset = await fetchAsset(this.umi, this.toUmiPublicKey(passAddress));
      const appDataPlugin = asset.appDatas?.[0];
      
      if (!appDataPlugin) {
        throw new Error("AppData plugin not found");
      }

      // Get current data
      const currentData = appDataPlugin.data || {
        xp: 0,
        lastAction: null,
        actionHistory: [],
        currentTier: "Grind",
        tierUpdatedAt: Date.now(),
        rewards: ["nothing for you!"]
      };

      // Ensure we're using the actual current XP
      const currentXp = currentData.xp || 0;

      // Calculate new points
      const collection = await fetchCollection(this.umi, this.toUmiPublicKey(this.collectionAddress!));
      const pointsPerAction = JSON.parse(
        collection.attributes?.attributeList.find(attr => attr.key === "pointsPerAction")?.value || "{}"
      );

      const points = (pointsPerAction[action] || 0) * multiplier;
      const newXp = currentXp + points;

      // Calculate new tier
      const tiers = JSON.parse(
        collection.attributes?.attributeList.find(attr => attr.key === "tiers")?.value || "[]"
      );
      const newTier = tiers.reduce(
        (acc: any, tier: any) => {
          if (newXp >= tier.xpRequired && (!acc || tier.xpRequired > acc.xpRequired)) {
            return tier;
          }
          return acc;
        },
        { name: "Grind", xpRequired: 0, rewards: ["nothing for you!"] }
      );

      // Write updated data (using the already set userWallet as fee payer)
      const tx = await writeData(this.umi, {
        key: {
          type: "AppData",
          dataAuthority: appDataPlugin.dataAuthority,
        },
        authority: signer,
        data: new TextEncoder().encode(JSON.stringify({
          xp: newXp,
          lastAction: action,
          currentTier: newTier.name,
          tierUpdatedAt: newTier.name !== currentData.currentTier ? Date.now() : currentData.tierUpdatedAt,
          actionHistory: [
            ...(currentData.actionHistory || []),
            {
              type: action,
              points,
              timestamp: Date.now(),
              newTotal: newXp
            }
          ],
          rewards: newTier.rewards
        })),
        asset: publicKey(passAddress),
        collection: this.toUmiPublicKey(this.collectionAddress!),
      }).sendAndConfirm(this.umi);

      return {
        points: newXp,
        signature: bs58.encode(tx.signature)
      };
    } catch (error) {
      throw new Error(`Failed to award points: ${error}`);
    }
  }

  /**
   * Get asset's AppData including XP, tier, and action history
   */
  async getAssetData(passAddress: PublicKey): Promise<{
    xp: number;
    lastAction: string | null;
    actionHistory: Array<{
      type: string;
      points: number;
      timestamp: number;
      newTotal: number;
    }>;
    currentTier: string;
    tierUpdatedAt: number;
    rewards: string[];
  } | null> {
    try {
      const asset = await fetchAsset(
        this.umi,
        this.toUmiPublicKey(passAddress)
      );
      const appDataPlugin = asset.appDatas?.find(
        (p: any) => p.type === "AppData"
      );

      if (!appDataPlugin || !appDataPlugin.data) {
        return null;
      }

      return appDataPlugin.data;
    } catch (error) {
      throw new Error(`Failed to fetch asset data: ${error}`);
    }
  }

  /**
   * Approve and execute a loyalty pass transfer (organization only)
   */
  async approveTransfer(
    passAddress: PublicKey,
    toAddress: PublicKey
  ): Promise<void> {
    if (!this.programAuthority) {
      throw new Error("Program authority not configured");
    }

    try {
      await transferV1(this.umi, {
        asset: this.toUmiPublicKey(passAddress),
        newOwner: this.toUmiPublicKey(toAddress),
        collection: this.toUmiPublicKey(this.collectionAddress!),
      }).sendAndConfirm(this.umi);
    } catch (error) {
      throw new Error(`Failed to approve transfer: ${error}`);
    }
  }

  /**
   * Get all loyalty passes owned by a wallet
   */
  async getWalletLoyaltyPasses(
    walletAddress: PublicKey
  ): Promise<AssetV1[]> {
    try {
      return await fetchAssetsByOwner(
        this.umi,
        this.toUmiPublicKey(walletAddress)
      );
    } catch (error) {
      throw new Error(`Failed to fetch wallet loyalty passes: ${error}`);
    }
  }

  /**
   * Get all actions and their point values for the program
   */
  async getPointsPerAction(): Promise<Record<string, number>> {
    if (!this.collectionAddress) {
      throw new Error("Collection not initialized");
    }

    try {
      const collection = await fetchCollection(this.umi, this.toUmiPublicKey(this.collectionAddress));
      const pointsPerAction = JSON.parse(
        collection.attributes?.attributeList.find(attr => attr.key === "pointsPerAction")?.value || "{}"
      );
      return pointsPerAction;
    } catch (error) {
      throw new Error(`Failed to fetch points per action: ${error}`);
    }
  }

  /**
   * Get all tiers and their requirements for the program
   */
  async getProgramTiers(): Promise<Array<{
    name: string;
    xpRequired: number;
    rewards: string[];
  }>> {
    if (!this.collectionAddress) {
      throw new Error("Collection not initialized");
    }

    try {
      const collection = await fetchCollection(this.umi, this.toUmiPublicKey(this.collectionAddress));
      const tiers = JSON.parse(
        collection.attributes?.attributeList.find(attr => attr.key === "tiers")?.value || "[]"
      );
      return tiers;
    } catch (error) {
      throw new Error(`Failed to fetch program tiers: ${error}`);
    }
  }

  /**
   * Get program details including name and metadata
   */
  async getProgramDetails(): Promise<{
    name: string;
    uri: string;
    collectionAddress: string;
    updateAuthority: string;
    numMinted: number;
    transferAuthority: string;
    creator: string;
  }> {
    if (!this.collectionAddress) {
      throw new Error("Collection not initialized");
    }

    try {
      const collection = await fetchCollection(this.umi, this.toUmiPublicKey(this.collectionAddress));
      return {
        name: collection.name,
        uri: collection.uri,
        collectionAddress: collection.publicKey,
        updateAuthority: collection.updateAuthority,
        numMinted: collection.numMinted,
        transferAuthority: collection.permanentTransferDelegate?.authority.address?.toString()!,
        creator: collection.attributes?.attributeList.find(attr => attr.key === "creator")?.value!,
      };
    } catch (error) {
      throw new Error(`Failed to fetch program details: ${error}`);
    }
  }
}

export default VerxioProtocol;