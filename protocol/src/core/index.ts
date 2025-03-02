import { PublicKey } from '@solana/web3.js';
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { 
  createCollection, 
  addPlugin, 
  updatePlugin, 
  create, 
  fetchAsset,
  ExternalPluginAdapterSchema,
  PluginAuthority, 
  CollectionV1,
  writeData, 
  AssetV1,
  Plugin,
  ExternalPluginAdapter,
} from '@metaplex-foundation/mpl-core';
import { 
  VerxioConfig, 
  LoyaltyProgramData, 
  Tier, 
  PointAction,
  AttributePlugin,
  AppDataPlugin,
  VerxioPlugin,
  PointsPerActionMap,
  AssetWithPlugins
} from '../types';
import { PublicKey as UmiPublicKey } from '@metaplex-foundation/umi';

export class VerxioProtocol {
  private config: VerxioConfig;
  private collectionAddress: PublicKey | null = null;

  constructor(config: VerxioConfig) {
    this.config = config;
  }

  // Convert Solana PublicKey to Umi PublicKey
  private toUmiPublicKey(key: PublicKey): UmiPublicKey {
    return publicKey(key.toBase58()) as UmiPublicKey;
  }

  // Add helper method to convert signature to PublicKey
  private signatureToPublicKey(signature: Uint8Array): PublicKey {
    return new PublicKey(Buffer.from(signature).toString('hex'));
  }

  /**
   * Creates a new loyalty program with tiers and point actions
   */
  async createProgram(data: LoyaltyProgramData): Promise<PublicKey> {
    try {
      const collectionSigner = generateSigner(this.config.umi);

      const tx = await createCollection(this.config.umi, {
        name: data.organizationName,
        uri: data.metadataUri,
        collection: collectionSigner,
        plugins: [
          {
            type: 'Attributes',
            attributeList: [
              { key: 'programType', value: 'loyalty' },
              { key: 'tiers', value: JSON.stringify(data.tiers) },
              { key: 'pointsPerAction', value: JSON.stringify(data.pointsPerAction) }
            ]
          },
          {
            type: 'PermanentTransferDelegate',
            authority: { 
              type: 'Address', 
              address: this.toUmiPublicKey(this.config.programAuthority) 
            } as PluginAuthority
          }
        ]
      }).sendAndConfirm(this.config.umi);

      this.collectionAddress = this.signatureToPublicKey(tx.signature);
      return this.collectionAddress;
    } catch (error) {
      throw new Error(`Failed to create loyalty program: ${error}`);
    }
  }

  /**
   * Issues a loyalty NFT pass to a user
   */
  async issueLoyaltyPass(recipient: PublicKey): Promise<PublicKey> {
    if (!this.collectionAddress) {
      throw new Error('Collection not initialized. Call createProgram first.');
    }

    try {
      const assetSigner = generateSigner(this.config.umi);

      const tx = await create(this.config.umi, {
        asset: assetSigner,
        name: `${this.config.organizationName} Loyalty Pass`,
        uri: this.config.passMetadataUri,
        collection: {
          publicKey: this.toUmiPublicKey(this.collectionAddress),
          oracles: [],
          lifecycleHooks: []
        },
        plugins: [
          {
            type: 'AppData',
            dataAuthority: { 
              type: 'Address', 
              address: this.toUmiPublicKey(this.config.programAuthority) 
            } as PluginAuthority,
            schema: ExternalPluginAdapterSchema.Json,
            initPluginAuthority: {
              type: 'Address',
              address: this.toUmiPublicKey(this.config.programAuthority)
            } as PluginAuthority
          },
          {
            type: 'Attributes',
            attributeList: [
              { key: 'type', value: 'loyaltyPass' },
              { key: 'xp', value: '0' }
            ]
          }
        ]
      }).sendAndConfirm(this.config.umi);

      return this.signatureToPublicKey(tx.signature);
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
    multiplier: number = 1
  ): Promise<number> {
    try {
      type AssetWithPlugins = AssetV1 & {
        plugins: VerxioPlugin[];
      };

      const asset = (await fetchAsset(this.config.umi, this.toUmiPublicKey(passAddress))) as unknown as AssetWithPlugins;
      const attributePlugin = asset.plugins.find((p): p is AttributePlugin => p.type === 'Attributes');
      const pointsPerAction = JSON.parse(
        attributePlugin?.attributeList
          .find(a => a.key === 'pointsPerAction')?.value || '{}'
      ) as PointsPerActionMap;
      
      const points = pointsPerAction[action] * multiplier;
      const currentXp = Number(attributePlugin?.attributeList
        .find((a: { key: string; value: string }) => a.key === 'xp')?.value || '0');
      const newXp = currentXp + points;

      await writeData(this.config.umi, {
        key: {
          type: 'AppData',
          dataAuthority: { 
            type: 'Address',
            address: this.toUmiPublicKey(this.config.programAuthority) 
          } as PluginAuthority,
        },
        authority: generateSigner(this.config.umi),
        data: new TextEncoder().encode(JSON.stringify({
          xp: newXp,
          lastAction: {
            type: action,
            points,
            timestamp: Date.now()
          }
        })),
        asset: this.toUmiPublicKey(passAddress)
      });

      await updatePlugin(this.config.umi, {
        asset: this.toUmiPublicKey(passAddress),
        plugin: {
          type: 'Attributes',
          attributeList: [
            { key: 'xp', value: newXp.toString() }
          ]
        }
      });

      await this.checkAndUpdateTier(passAddress, newXp);
      return newXp;
    } catch (error) {
      throw new Error(`Failed to award points: ${error}`);
    }
  }

  private async checkAndUpdateTier(
    passAddress: PublicKey, 
    currentXp: number
  ): Promise<void> {
    type AssetWithPlugins = AssetV1 & {
      plugins: VerxioPlugin[];
    };

    const asset = (await fetchAsset(this.config.umi, this.toUmiPublicKey(passAddress))) as unknown as AssetWithPlugins;
    const tiers = asset.plugins.find((p: VerxioPlugin) => p.type === 'Attributes')?.attributeList
      .find((a: { key: string; value: string }) => a.key === 'tiers')?.value || '[]';

    const newTier = JSON.parse(tiers).reduce((acc: Tier, tier: Tier) => {
      if (currentXp >= tier.xpRequired && (!acc || tier.xpRequired > acc.xpRequired)) {
        return tier;
      } 
      return acc;
    }, null);

    if (newTier && newTier.name !== asset.plugins.find((p: VerxioPlugin) => p.type === 'AppData')?.data?.currentTier) {
      await writeData(this.config.umi, {
        key: {
          type: 'AppData',
          dataAuthority: { 
            type: 'Address',
            address: this.toUmiPublicKey(this.config.programAuthority) 
          } as PluginAuthority,
        },
        authority: generateSigner(this.config.umi),
        data: new TextEncoder().encode(JSON.stringify({
          ...asset.plugins.find((p: VerxioPlugin) => p.type === 'AppData')?.data || {},
          currentTier: newTier.name,
          tierUpdatedAt: Date.now()
        })),
        asset: this.toUmiPublicKey(passAddress)
      });
    }
  }

  async claimXP(
    passAddress: PublicKey,
    action: string,
    proof: string
  ): Promise<number> {
    try {
      type AssetWithPlugins = AssetV1 & {
        plugins: VerxioPlugin[];
      };

      const asset = (await fetchAsset(this.config.umi, this.toUmiPublicKey(passAddress))) as unknown as AssetWithPlugins;
      const attributePlugin = asset.plugins.find((p): p is AttributePlugin => p.type === 'Attributes');
      const pointsPerAction = JSON.parse(
        attributePlugin?.attributeList
          .find(a => a.key === 'pointsPerAction')?.value || '{}'
      ) as PointsPerActionMap;

      if (!pointsPerAction[action]) {
        throw new Error(`Action ${action} not recognized`);
      }

      // Verify the action proof here
      // ... verification logic ...

      // Award points
      return this.awardPoints(passAddress, action);
    } catch (error) {
      throw new Error(`Failed to claim XP: ${error}`);
    }
  }
}

export default VerxioProtocol; 