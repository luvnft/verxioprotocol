import { CreateLoyaltyProgramParams } from '@/lib/methods/createLoyaltyProgram'

export async function generateNftMetadata(
  params: CreateLoyaltyProgramParams,
  imageUri: string,
  creatorAddress: string,
  fileType: string = 'image/png', // allow override if needed
): Promise<{ metadata: any; uri: string }> {
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

  const metadataObj = {
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

  try {
    const response = await fetch('/api/metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadataObj),
    })

    if (!response.ok) {
      throw new Error('Failed to upload metadata')
    }

    const uri = await response.json()
    return { metadata: metadataObj, uri }
  } catch (error) {
    console.error('Error uploading metadata:', error)
    throw new Error('Failed to upload metadata to IPFS')
  }
}
