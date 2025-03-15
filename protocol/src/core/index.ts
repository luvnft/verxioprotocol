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

// Constants
const DEFAULT_TIER = {
  name: "Grind",
  xpRequired: 0,
  rewards: ["nothing for you!"]
};

const DEFAULT_PASS_DATA = {
  xp: 0,
  lastAction: null,
  actionHistory: [],
  currentTier: DEFAULT_TIER.name,
  tierUpdatedAt: Date.now(),
  rewards: DEFAULT_TIER.rewards
};

const PLUGIN_TYPES = {
  ATTRIBUTES: "Attributes",
  APP_DATA: "AppData",
  PERMANENT_TRANSFER_DELEGATE: "PermanentTransferDelegate"
} as const;

const ATTRIBUTE_KEYS = {
  PROGRAM_TYPE: "programType",
  TIERS: "tiers",
  POINTS_PER_ACTION: "pointsPerAction",
  CREATOR: "creator",
  TYPE: "type",
  XP: "xp"
} as const;

const DEFAULT_RPC_URLS: Record<Network, string> = {
  mainnet: "https://api.mainnet-beta.solana.com",
  devnet: "https://api.devnet.solana.com",
  "sonic-mainnet": "https://api.mainnet-alpha.sonic.game",
  "sonic-testnet": "https://api.testnet.sonic.game",
};

// Types
export interface VerxioContext {
  umi: Umi;
  network: Network;
  programAuthority: PublicKey;
  userWallet?: WalletAdapter;
  collectionAddress?: PublicKey;
}

// Helper Functions
const toUmiPublicKey = (key: PublicKey): UmiPublicKey => {
  return publicKey(key.toBase58()) as UmiPublicKey;
};

const validateWalletState = (context: VerxioContext) => {
  if (!context.userWallet) {
    throw new Error("User wallet not set");
  }
};

const validateCollectionState = (context: VerxioContext) => {
  if (!context.collectionAddress) {
    throw new Error("Collection not initialized");
  }
};

const getCollectionAttribute = async (context: VerxioContext, attributeKey: string): Promise<any> => {
  validateCollectionState(context);
  const collection = await fetchCollection(context.umi, toUmiPublicKey(context.collectionAddress!));
  const attribute = collection.attributes?.attributeList.find(attr => attr.key === attributeKey)?.value;
  return attribute ? JSON.parse(attribute) : null;
};

const calculateNewTier = async (context: VerxioContext, xp: number): Promise<{
  name: string;
  xpRequired: number;
  rewards: string[];
}> => {
  const tiers = await getCollectionAttribute(context, ATTRIBUTE_KEYS.TIERS) || [];
  return tiers.reduce(
    (acc: any, tier: any) => {
      if (xp >= tier.xpRequired && (!acc || tier.xpRequired > acc.xpRequired)) {
        return tier;
      }
      return acc;
    },
    DEFAULT_TIER
  );
};

const updatePassData = async (
  context: VerxioContext,
  passAddress: PublicKey,
  signer: ReturnType<typeof generateSigner>,
  appDataPlugin: any,
  updates: {
    xp: number;
    action: string;
    points: number;
    currentData: any;
    newTier: any;
  }
): Promise<{ points: number; signature: string }> => {
  const tx = await writeData(context.umi, {
    key: {
      type: PLUGIN_TYPES.APP_DATA,
      dataAuthority: appDataPlugin.dataAuthority,
    },
    authority: signer,
    data: new TextEncoder().encode(JSON.stringify({
      xp: updates.xp,
      lastAction: updates.action,
      currentTier: updates.newTier.name,
      tierUpdatedAt: updates.newTier.name !== updates.currentData.currentTier 
        ? Date.now() 
        : updates.currentData.tierUpdatedAt,
      actionHistory: [
        ...(updates.currentData.actionHistory || []),
        {
          type: updates.action,
          points: updates.points,
          timestamp: Date.now(),
          newTotal: updates.xp
        }
      ],
      rewards: updates.newTier.rewards
    })),
    asset: publicKey(passAddress),
    collection: toUmiPublicKey(context.collectionAddress!),
  }).sendAndConfirm(context.umi);

  return {
    points: updates.xp,
    signature: bs58.encode(tx.signature)
  };
};

// Main Functions
export const initializeVerxio = (
  network: Network, 
  programAuthority: PublicKey, 
  userWallet?: WalletAdapter,
  rpcUrl?: string
): VerxioContext => {
  const commitment: Commitment = 'processed';   
  const finalRpcUrl = rpcUrl || DEFAULT_RPC_URLS[network];
  const connection = new Connection(finalRpcUrl, {
    commitment,
    wsEndpoint: finalRpcUrl
  });
  const umi = createUmi(connection);

  if (userWallet) {
    const walletSigner = createSignerFromWalletAdapter(userWallet);
    umi.use(signerIdentity(walletSigner));
  }

  return {
    umi,
    network,
    programAuthority,
    userWallet
  };
};

export const createLoyaltyProgram = async (
  context: VerxioContext,
  data: Omit<LoyaltyProgramData, 'network' | 'programAuthority' | 'rpcUrl'>
): Promise<{
  LoyaltyProgramId: string;
  signature: string;
  collectionPrivateKey: string;
}> => {
  try {
    const collectionSigner = generateSigner(context.umi);
    const collectionPublicKey = new PublicKey(collectionSigner.publicKey);

    const tx = await createCollection(context.umi, {
      name: data.organizationName,
      uri: data.metadataUri,
      collection: collectionSigner,
      plugins: [
        {
          type: PLUGIN_TYPES.ATTRIBUTES,
          attributeList: [
            { key: ATTRIBUTE_KEYS.PROGRAM_TYPE, value: "loyalty" },
            { key: ATTRIBUTE_KEYS.TIERS, value: JSON.stringify(data.tiers) },
            { key: ATTRIBUTE_KEYS.POINTS_PER_ACTION, value: JSON.stringify(data.pointsPerAction) },
            { key: ATTRIBUTE_KEYS.CREATOR, value: context.programAuthority.toString() },
          ],
        },
        {
          type: PLUGIN_TYPES.PERMANENT_TRANSFER_DELEGATE,
          authority: { 
            type: "Address",
            address: toUmiPublicKey(context.programAuthority),
          } as PluginAuthority,
        },
      ],
    }).sendAndConfirm(context.umi);

    return {
      LoyaltyProgramId: collectionPublicKey.toString(),
      signature: bs58.encode(tx.signature),
      collectionPrivateKey: bs58.encode(collectionSigner.secretKey),
    };
  } catch (error) {
    throw new Error(`Failed to create loyalty program: ${error}`);
  }
};

export const issueLoyaltyPass = async (
  context: VerxioContext,
  collectionAddress: PublicKey,
  recipient: PublicKey,
  passName: string,
  passMetadataUri: string
): Promise<{
  signer: ReturnType<typeof generateSigner>;
  signature: string;
}> => {
  validateWalletState(context);

  try {
    const assetSigner = generateSigner(context.umi);
    const walletSigner = createSignerFromWalletAdapter(context.userWallet!);
    context.umi.use(signerIdentity(walletSigner));
    
    const createTx = await create(context.umi, {
      asset: assetSigner,
      name: passName,
      uri: passMetadataUri,
      owner: toUmiPublicKey(recipient),
      collection: {
        publicKey: toUmiPublicKey(collectionAddress),
      },
      plugins: [
        {
          type: PLUGIN_TYPES.APP_DATA,
          dataAuthority: { 
            type: "Address",
            address: assetSigner.publicKey,
          },
          schema: ExternalPluginAdapterSchema.Json,
        },
        {
          type: PLUGIN_TYPES.ATTRIBUTES,
          attributeList: [
            { key: ATTRIBUTE_KEYS.TYPE, value: `${passName} loyalty pass` },
          ],
        },
      ],
    }).sendAndConfirm(context.umi);

    await writeData(context.umi, {
      key: {
        type: PLUGIN_TYPES.APP_DATA,
        dataAuthority: {
          type: "Address",
          address: assetSigner.publicKey,
        },
      },
      authority: assetSigner,
      data: new TextEncoder().encode(JSON.stringify(DEFAULT_PASS_DATA)),
      asset: publicKey(assetSigner.publicKey),
      collection: toUmiPublicKey(collectionAddress),
    }).sendAndConfirm(context.umi);

    return {
      signer: assetSigner,
      signature: bs58.encode(createTx.signature)
    };
  } catch (error) {
    throw new Error(`Failed to issue loyalty pass: ${error}`);
  }
};

export const awardLoyaltyPoints = async (
  context: VerxioContext,
  passAddress: PublicKey, 
  action: string, 
  signer: ReturnType<typeof generateSigner>,
  multiplier: number = 1
): Promise<{ points: number; signature: string }> => {
  validateWalletState(context);

  try {
    const asset = await fetchAsset(context.umi, toUmiPublicKey(passAddress));
    const appDataPlugin = asset.appDatas?.[0];
    
    if (!appDataPlugin) {
      throw new Error("AppData plugin not found");
    }

    const currentData = appDataPlugin.data || DEFAULT_PASS_DATA;
    const currentXp = currentData.xp || 0;

    const pointsPerAction = await getCollectionAttribute(context, ATTRIBUTE_KEYS.POINTS_PER_ACTION) || {};
    const points = (pointsPerAction[action] || 0) * multiplier;
    const newXp = currentXp + points;

    const newTier = await calculateNewTier(context, newXp);

    return updatePassData(context, passAddress, signer, appDataPlugin, {
      xp: newXp,
      action,
      points,
      currentData,
      newTier
    });
  } catch (error) {
    throw new Error(`Failed to award points: ${error}`);
  }
};

export const revokeLoyaltyPoints = async (
  context: VerxioContext,
  passAddress: PublicKey, 
  points: number,
  signer: ReturnType<typeof generateSigner>,
): Promise<{ points: number; signature: string }> => {
  validateWalletState(context);

  try {
    const asset = await fetchAsset(context.umi, toUmiPublicKey(passAddress));
    const appDataPlugin = asset.appDatas?.[0];
    
    if (!appDataPlugin) {
      throw new Error("AppData plugin not found");
    }

    const currentData = appDataPlugin.data || DEFAULT_PASS_DATA;
    const newXp = Math.max(0, currentData.xp - points);
    const newTier = await calculateNewTier(context, newXp);

    return updatePassData(context, passAddress, signer, appDataPlugin, {
      xp: newXp,
      action: 'revoke',
      points: -points,
      currentData,
      newTier
    });
  } catch (error) {
    throw new Error(`Failed to reduce points: ${error}`);
  }
};

export const getAssetData = async (
  context: VerxioContext,
  passAddress: PublicKey
): Promise<{
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
} | null> => {
  try {
    const asset = await fetchAsset(context.umi, toUmiPublicKey(passAddress));
    const appDataPlugin = asset.appDatas?.find((p: any) => p.type === PLUGIN_TYPES.APP_DATA);

    if (!appDataPlugin || !appDataPlugin.data) {
      return null;
    }

    return appDataPlugin.data;
  } catch (error) {
    throw new Error(`Failed to fetch asset data: ${error}`);
  }
};

export const approveTransfer = async (
  context: VerxioContext,
  passAddress: PublicKey,
  toAddress: PublicKey
): Promise<void> => {
  validateCollectionState(context);

  try {
    await transferV1(context.umi, {
      asset: toUmiPublicKey(passAddress),
      newOwner: toUmiPublicKey(toAddress),
      collection: toUmiPublicKey(context.collectionAddress!),
    }).sendAndConfirm(context.umi);
  } catch (error) {
    throw new Error(`Failed to approve transfer: ${error}`);
  }
};

export const getWalletLoyaltyPasses = async (
  context: VerxioContext,
  walletAddress: PublicKey
): Promise<AssetV1[]> => {
  try {
    return await fetchAssetsByOwner(context.umi, toUmiPublicKey(walletAddress));
  } catch (error) {
    throw new Error(`Failed to fetch wallet loyalty passes: ${error}`);
  }
};

export const getPointsPerAction = async (
  context: VerxioContext
): Promise<Record<string, number>> => {
  validateCollectionState(context);

  try {
    return await getCollectionAttribute(context, ATTRIBUTE_KEYS.POINTS_PER_ACTION) || {};
  } catch (error) {
    throw new Error(`Failed to fetch points per action: ${error}`);
  }
};

export const getProgramTiers = async (
  context: VerxioContext
): Promise<Array<{
  name: string;
  xpRequired: number;
  rewards: string[];
}>> => {
  validateCollectionState(context);

  try {
    return await getCollectionAttribute(context, ATTRIBUTE_KEYS.TIERS) || [];
  } catch (error) {
    throw new Error(`Failed to fetch program tiers: ${error}`);
  }
};

export const getProgramDetails = async (
  context: VerxioContext
): Promise<{
  name: string;
  uri: string;
  collectionAddress: string;
  updateAuthority: string;
  numMinted: number;
  transferAuthority: string;
  creator: string;
}> => {
  validateCollectionState(context);

  try {
    const collection = await fetchCollection(context.umi, toUmiPublicKey(context.collectionAddress!));
    return {
      name: collection.name,
      uri: collection.uri,
      collectionAddress: collection.publicKey,
      updateAuthority: collection.updateAuthority,
      numMinted: collection.numMinted,
      transferAuthority: collection.permanentTransferDelegate?.authority.address?.toString()!,
      creator: collection.attributes?.attributeList.find(attr => attr.key === ATTRIBUTE_KEYS.CREATOR)?.value!,
    };
  } catch (error) {
    throw new Error(`Failed to fetch program details: ${error}`);
  }
};
