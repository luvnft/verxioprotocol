import { generateSigner, KeypairSigner, publicKey, PublicKey as UmiPublicKey, Umi } from '@metaplex-foundation/umi'
import {
  AssetV1,
  create,
  createCollection,
  ExternalPluginAdapterSchema,
  fetchAsset,
  fetchAssetsByOwner,
  fetchCollection,
  PluginAuthority,
  transferV1,
  writeData,
} from '@metaplex-foundation/mpl-core'
import { toBase58 } from '@/utils/to-base58'
import { ATTRIBUTE_KEYS, DEFAULT_PASS_DATA, DEFAULT_TIER, PLUGIN_TYPES } from './constants'
import { validateCollectionState } from '@/utils/validate-collection-state'
import { VerxioContext } from '@/types/verxio-context'
import { IssueLoyaltyPassConfig } from '@/types/issue-loyalty-pass-config'
import { CreateLoyaltyProgramConfig } from '@/types/create-loyalty-program-config'
import { LoyaltyProgramTier } from '@/types/loyalty-program-tier'

async function getCollectionAttribute(context: VerxioContext, attributeKey: string): Promise<any> {
  validateCollectionState(context)
  const collection = await fetchCollection(context.umi, context.collectionAddress!)
  const attribute = collection.attributes?.attributeList.find((attr) => attr.key === attributeKey)?.value
  return attribute ? JSON.parse(attribute) : null
}

async function calculateNewTier(context: VerxioContext, xp: number): Promise<LoyaltyProgramTier> {
  const tiers = (await getCollectionAttribute(context, ATTRIBUTE_KEYS.TIERS)) || []
  return tiers.reduce((acc: any, tier: any) => {
    if (xp >= tier.xpRequired && (!acc || tier.xpRequired > acc.xpRequired)) {
      return tier
    }
    return acc
  }, DEFAULT_TIER)
}

async function updatePassData(
  context: VerxioContext,
  passAddress: UmiPublicKey,
  signer: KeypairSigner,
  appDataPlugin: any,
  updates: {
    xp: number
    action: string
    points: number
    currentData: any
    newTier: any
  },
): Promise<{ points: number; signature: string }> {
  const tx = await writeData(context.umi, {
    key: {
      type: PLUGIN_TYPES.APP_DATA,
      dataAuthority: appDataPlugin.dataAuthority,
    },
    authority: signer,
    data: new TextEncoder().encode(
      JSON.stringify({
        xp: updates.xp,
        lastAction: updates.action,
        currentTier: updates.newTier.name,
        tierUpdatedAt:
          updates.newTier.name !== updates.currentData.currentTier ? Date.now() : updates.currentData.tierUpdatedAt,
        actionHistory: [
          ...(updates.currentData.actionHistory || []),
          {
            type: updates.action,
            points: updates.points,
            timestamp: Date.now(),
            newTotal: updates.xp,
          },
        ],
        rewards: updates.newTier.rewards,
      }),
    ),
    asset: passAddress,
    collection: context.collectionAddress!,
  }).sendAndConfirm(context.umi)

  return {
    points: updates.xp,
    signature: toBase58(tx.signature),
  }
}

// Main Functions
export function initializeVerxio(umi: Umi, programAuthority: UmiPublicKey): VerxioContext {
  return {
    umi,
    programAuthority,
  }
}
export async function createLoyaltyProgram(
  context: VerxioContext,
  config: CreateLoyaltyProgramConfig,
): Promise<{
  signer: KeypairSigner
  signature: string
}> {
  try {
    const signer = config.collectionSigner ?? generateSigner(context.umi)

    const tx = await createCollection(context.umi, {
      name: config.organizationName,
      uri: config.metadataUri,
      collection: signer,
      plugins: [
        {
          type: PLUGIN_TYPES.ATTRIBUTES,
          attributeList: [
            { key: ATTRIBUTE_KEYS.PROGRAM_TYPE, value: 'loyalty' },
            { key: ATTRIBUTE_KEYS.TIERS, value: JSON.stringify(config.tiers) },
            { key: ATTRIBUTE_KEYS.POINTS_PER_ACTION, value: JSON.stringify(config.pointsPerAction) },
            { key: ATTRIBUTE_KEYS.CREATOR, value: context.programAuthority.toString() },
          ],
        },
        {
          type: PLUGIN_TYPES.PERMANENT_TRANSFER_DELEGATE,
          authority: {
            type: 'Address',
            address: context.programAuthority,
          } as PluginAuthority,
        },
      ],
    }).sendAndConfirm(context.umi)

    return {
      signer,
      signature: toBase58(tx.signature),
    }
  } catch (error) {
    throw new Error(`Failed to create loyalty program: ${error}`)
  }
}

export async function issueLoyaltyPass(
  context: VerxioContext,
  config: IssueLoyaltyPassConfig,
): Promise<{
  signer: KeypairSigner
  signature: string
}> {
  try {
    const signer = config.assetSigner ?? generateSigner(context.umi)
    const tx = await create(context.umi, {
      asset: signer,
      name: config.passName,
      uri: config.passMetadataUri,
      owner: config.recipient,
      collection: {
        publicKey: config.collectionAddress,
      },
      plugins: [
        {
          type: PLUGIN_TYPES.APP_DATA,
          dataAuthority: {
            type: 'Address',
            address: signer.publicKey,
          },
          schema: ExternalPluginAdapterSchema.Json,
        },
        {
          type: PLUGIN_TYPES.ATTRIBUTES,
          attributeList: [{ key: ATTRIBUTE_KEYS.TYPE, value: `${config.passName} loyalty pass` }],
        },
      ],
    }).sendAndConfirm(context.umi)

    await writeData(context.umi, {
      key: {
        type: PLUGIN_TYPES.APP_DATA,
        dataAuthority: {
          type: 'Address',
          address: signer.publicKey,
        },
      },
      authority: signer,
      data: new TextEncoder().encode(JSON.stringify(DEFAULT_PASS_DATA)),
      asset: publicKey(signer.publicKey),
      collection: config.collectionAddress,
    }).sendAndConfirm(context.umi)

    return {
      signer,
      signature: toBase58(tx.signature),
    }
  } catch (error) {
    throw new Error(`Failed to issue loyalty pass: ${error}`)
  }
}

export async function awardLoyaltyPoints(
  context: VerxioContext,
  passAddress: UmiPublicKey,
  action: string,
  signer: KeypairSigner,
  multiplier: number = 1,
): Promise<{ points: number; signature: string }> {
  try {
    const asset = await fetchAsset(context.umi, passAddress)
    const appDataPlugin = asset.appDatas?.[0]

    if (!appDataPlugin) {
      throw new Error('AppData plugin not found')
    }

    const currentData = appDataPlugin.data || DEFAULT_PASS_DATA
    const currentXp = currentData.xp || 0

    const pointsPerAction = (await getCollectionAttribute(context, ATTRIBUTE_KEYS.POINTS_PER_ACTION)) || {}
    const points = (pointsPerAction[action] || 0) * multiplier
    const newXp = currentXp + points

    const newTier = await calculateNewTier(context, newXp)

    return updatePassData(context, passAddress, signer, appDataPlugin, {
      xp: newXp,
      action,
      points,
      currentData,
      newTier,
    })
  } catch (error) {
    throw new Error(`Failed to award points: ${error}`)
  }
}

export async function revokeLoyaltyPoints(
  context: VerxioContext,
  passAddress: UmiPublicKey,
  points: number,
  signer: KeypairSigner,
): Promise<{ points: number; signature: string }> {
  try {
    const asset = await fetchAsset(context.umi, passAddress)
    const appDataPlugin = asset.appDatas?.[0]

    if (!appDataPlugin) {
      throw new Error('AppData plugin not found')
    }

    const currentData = appDataPlugin.data || DEFAULT_PASS_DATA
    const newXp = Math.max(0, currentData.xp - points)
    const newTier = await calculateNewTier(context, newXp)

    return updatePassData(context, passAddress, signer, appDataPlugin, {
      xp: newXp,
      action: 'revoke',
      points: -points,
      currentData,
      newTier,
    })
  } catch (error) {
    throw new Error(`Failed to reduce points: ${error}`)
  }
}

export async function getAssetData(
  context: VerxioContext,
  passAddress: UmiPublicKey,
): Promise<{
  xp: number
  lastAction: string | null
  actionHistory: Array<{
    type: string
    points: number
    timestamp: number
    newTotal: number
  }>
  currentTier: string
  tierUpdatedAt: number
  rewards: string[]
} | null> {
  try {
    const asset = await fetchAsset(context.umi, passAddress)
    const appDataPlugin = asset.appDatas?.find((p: any) => p.type === PLUGIN_TYPES.APP_DATA)

    if (!appDataPlugin || !appDataPlugin.data) {
      return null
    }

    return appDataPlugin.data
  } catch (error) {
    throw new Error(`Failed to fetch asset data: ${error}`)
  }
}

export async function approveTransfer(
  context: VerxioContext,
  passAddress: UmiPublicKey,
  toAddress: UmiPublicKey,
): Promise<void> {
  validateCollectionState(context)

  try {
    await transferV1(context.umi, {
      asset: passAddress,
      newOwner: toAddress,
      collection: context.collectionAddress!,
    }).sendAndConfirm(context.umi)
  } catch (error) {
    throw new Error(`Failed to approve transfer: ${error}`)
  }
}

export async function getWalletLoyaltyPasses(context: VerxioContext, walletAddress: UmiPublicKey): Promise<AssetV1[]> {
  try {
    return await fetchAssetsByOwner(context.umi, walletAddress)
  } catch (error) {
    throw new Error(`Failed to fetch wallet loyalty passes: ${error}`)
  }
}

export async function getPointsPerAction(context: VerxioContext): Promise<Record<string, number>> {
  validateCollectionState(context)

  try {
    return (await getCollectionAttribute(context, ATTRIBUTE_KEYS.POINTS_PER_ACTION)) || {}
  } catch (error) {
    throw new Error(`Failed to fetch points per action: ${error}`)
  }
}

export async function getProgramTiers(context: VerxioContext): Promise<LoyaltyProgramTier[]> {
  validateCollectionState(context)

  try {
    return (await getCollectionAttribute(context, ATTRIBUTE_KEYS.TIERS)) || []
  } catch (error) {
    throw new Error(`Failed to fetch program tiers: ${error}`)
  }
}

export async function getProgramDetails(context: VerxioContext): Promise<{
  name: string
  uri: string
  collectionAddress: string
  updateAuthority: string
  numMinted: number
  transferAuthority: string
  creator: string
}> {
  validateCollectionState(context)

  try {
    const collection = await fetchCollection(context.umi, context.collectionAddress!)
    return {
      name: collection.name,
      uri: collection.uri,
      collectionAddress: collection.publicKey,
      updateAuthority: collection.updateAuthority,
      numMinted: collection.numMinted,
      transferAuthority: collection.permanentTransferDelegate?.authority.address?.toString()!,
      creator: collection.attributes?.attributeList.find((attr) => attr.key === ATTRIBUTE_KEYS.CREATOR)?.value!,
    }
  } catch (error) {
    throw new Error(`Failed to fetch program details: ${error}`)
  }
}
