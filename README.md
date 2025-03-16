# Verxio Protocol

Reward Protocol for creating and managing loyalty programs on Solana and SVM.

## Features

- Create loyalty programs with custom tiers and rewards
- Issue loyalty passes as NFTs
- Track user XP and tier progression
- Support for transferable loyalty passes (with organization approval)
- Built-in support for multiple networks (Solana, Sonic)
- Automatic tier progression based on XP

## Installation

```bash
npm install @verxioprotocol/core
# or
yarn add @verxioprotocol/core
# or
pnpm add @verxioprotocol/core
```

## Usage

### Initialize Protocol

```typescript
import { initializeVerxio, createUmi } from '@verxioprotocol/core'
import { publicKey } from '@metaplex-foundation/umi'

// Create UMI instance
const umi = createUmi('https://mainnet.rpc.sonic.so')

// Initialize protocol
const context = initializeVerxio(
  umi,
  publicKey('PROGRAM_AUTHORITY') // Program authority public key
)
```

### Create Loyalty Program

```typescript
const result = await createLoyaltyProgram(context, {
  organizationName: 'Coffee Rewards',
  metadataUri: 'https://arweave.net/...',
  programAuthority: context.programAuthority,
  tiers: [
    {
      name: 'Bronze',
      xpRequired: 500,
      rewards: ['2% cashback'],
    },
    {
      name: 'Silver',
      xpRequired: 1000,
      rewards: ['5% cashback'],
    },
  ],
  pointsPerAction: {
    purchase: 100,
    review: 50,
  },
})

console.log(result)
// {
//   signer: KeypairSigner,    // Collection signer
//   signature: string         // Transaction signature
// }
```

### Issue Loyalty Pass

```typescript
const result = await issueLoyaltyPass(context, {
  collectionAddress: context.collectionAddress,
  recipient: publicKey('RECIPIENT_ADDRESS'),
  passName: 'Coffee Rewards Pass',
  passMetadataUri: 'https://arweave.net/...'
})

console.log(result)
// {
//   signer: KeypairSigner,  // Pass signer
//   signature: string       // Transaction signature
// }
```

### Award Points

```typescript
const result = await awardLoyaltyPoints(
  context,
  passAddress,     // UMI PublicKey of the pass
  'purchase',      // Action name
  passSigner,      // KeypairSigner from issueLoyaltyPass
  1                // Optional: Point multiplier (default: 1)
)

console.log(result)
// {
//   points: number,    // New total points
//   signature: string  // Transaction signature
// }
```

### Revoke Points

```typescript
const result = await revokeLoyaltyPoints(
  context,
  passAddress,     // UMI PublicKey of the pass
  pointsToReduce,  // Number of points to reduce
  passSigner      // KeypairSigner from issueLoyaltyPass
)

console.log(result)
// {
//   points: number,    // New total points after reduction
//   signature: string  // Transaction signature
// }
```

### Get Pass Data

```typescript
const data = await getAssetData(context, passAddress)

console.log(data)
// {
//   xp: number,
//   lastAction: string | null,
//   actionHistory: Array<{
//     type: string,
//     points: number,
//     timestamp: number,
//     newTotal: number
//   }>,
//   currentTier: string,
//   tierUpdatedAt: number,
//   rewards: string[]
// }
```

### Get Program Details

```typescript
const details = await getProgramDetails(context)

console.log(details)
// {
//   name: string,
//   uri: string,
//   collectionAddress: string,
//   updateAuthority: string,
//   numMinted: number,
//   transferAuthority: string,
//   creator: string
// }
```

### Transfer Pass

```typescript
await approveTransfer(
  context,
  passAddress,  // UMI PublicKey of the pass
  toAddress     // UMI PublicKey of the new owner
)
```

### Query Methods

```typescript
// Get all loyalty passes owned by a wallet
const passes = await getWalletLoyaltyPasses(
  context,
  walletAddress  // UMI PublicKey of the wallet
)

// Get program's points per action
const pointsPerAction = await getPointsPerAction(context)
// Returns: Record<string, number>

// Get program's tiers
const tiers = await getProgramTiers(context)
// Returns: Array<{
//   name: string,
//   xpRequired: number,
//   rewards: string[]
// }>
```

## Context Management

The `VerxioContext` interface defines the protocol's context:

```typescript
interface VerxioContext {
  umi: Umi;
  programAuthority: PublicKey;
  collectionAddress?: PublicKey;
}
```

## Error Handling

The protocol uses descriptive error messages. Always wrap calls in try-catch:

```typescript
try {
  await issueLoyaltyPass(context, {
    collectionAddress,
    recipient,
    passName,
    passMetadataUri
  })
} catch (error) {
  console.error(`Failed to issue pass: ${error}`)
}
```

## Testing Locally

```shell
# Clone the repository
git clone https://github.com/Axio-Lab/verxioprotocol.git
# cd into the directory
cd verxioprotocol
# Install dependencies
pnpm install
```

## Development

Format code:

```shell
pnpm fmt
```

Run tests:

```shell
pnpm test
```

Build the project:

```shell
pnpm build
```

## CI

Run all CI checks:

```shell
pnpm ci
```

## Dependencies

- @metaplex-foundation/umi
- @metaplex-foundation/mpl-core

## License

MIT

