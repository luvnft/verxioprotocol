import { CreateLoyaltyProgramParams } from '@/lib/methods/createLoyaltyProgram'

export function generateNftMetadata(
  params: CreateLoyaltyProgramParams,
  imageUri: string,
  creatorAddress: string,
  fileType: string = 'image/png', // allow override if needed
): any {
  const { loyaltyProgramName, metadata, tiers, pointsPerAction } = params

  const attributes = [
    ...Object.entries(pointsPerAction).map(([action, points]) => ({
      trait_type: `Points - ${action}`,
      value: points,
    })),
    ...tiers.flatMap((tier, index) => [
      {
        trait_type: `Tier ${index + 1} Name`,
        value: tier.name || 'Unnamed Tier',
      },
      {
        trait_type: `Tier ${index + 1} XP Required`,
        value: tier.xpRequired,
      },
      {
        trait_type: `Tier ${index + 1} Rewards`,
        value: tier.rewards?.join(', ') || 'None',
      },
    ]),
  ]

  return {
    name: loyaltyProgramName,
    symbol: 'VERXIO',
    description:
      'This NFT represents membership in the Verxio loyalty program. Unlock perks, rewards, and access based on your engagement.',
    image: imageUri,
    attributes,
    properties: {
      files: [{ uri: imageUri, type: fileType }],
      category: fileType.startsWith('video') ? 'video' : 'image',
      creators: [
        {
          address: creatorAddress,
          share: 100,
        },
      ],
      ...metadata,
    },
  }
}
