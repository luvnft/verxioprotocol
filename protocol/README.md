# Verxio Protocol

Reward Protocol for creating and managing loyalty programs on Solana and SVM

## Features

- Create loyalty programs with custom tiers and rewards
- Issue loyalty passes as NFTs
- Track user XP and tier progression
- Support for transferable loyalty passes (with organization approval)
- Automatic wallet and network handling
- Built-in support for multiple networks (Solana, Sonic)

## Installation

```bash
npm install @verxioprotocol/core
# or
yarn add @verxioprotocol/core
```

## Usage

### Initialize Protocol

```typescript
import { initializeVerxio } from '@verxioprotocol/core'
import { PublicKey } from '@solana/web3.js'
import { WalletAdapter } from '@solana/wallet-adapter-base'

// Initialize protocol with default RPC
const context = initializeVerxio(
  'devnet', // Network: 'devnet' | 'mainnet' | 'sonic-mainnet' | 'sonic-testnet'
  new PublicKey('PROGRAM_AUTHORITY'), // Program authority public key
  walletAdapter, // Optional: Wallet adapter for transactions
)

// Or initialize with custom RPC URL
const contextWithCustomRPC = initializeVerxio(
  'devnet',
  new PublicKey('PROGRAM_AUTHORITY'),
  walletAdapter,
  'https://your-custom-rpc.com', // Optional: Custom RPC URL
)
```

Each network has a default RPC URL:

```typescript
const DEFAULT_RPC_URLS = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
  'sonic-mainnet': 'https://api.mainnet-alpha.sonic.game',
  'sonic-testnet': 'https://api.testnet.sonic.game',
}
```

### Create Loyalty Program

```typescript
const result = await createLoyaltyProgram(context, {
  organizationName: 'Coffee Rewards',
  metadataUri: 'https://arweave.net/...',
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
//   LoyaltyProgramId: string,      // Collection address
//   signature: string,             // Transaction signature
//   collectionPrivateKey: string   // Collection signer private key
// }
```

### Issue Loyalty Pass

```typescript
const result = await issueLoyaltyPass(
  context,
  collectionAddress, // PublicKey of the program
  recipient, // PublicKey of the recipient
  'Coffee Rewards Pass',
  'https://arweave.net/...',
)

console.log(result)
// {
//   signer: KeypairSigner  // Pass signer
//   signature: string     // Transaction signature
// }
```

### Award Points

```typescript
const result = await awardLoyaltyPoints(
  context,
  passAddress, // PublicKey of the pass
  'purchase', // Action name
  passSigner, // Pass signer from issueLoyaltyPass
  1, // Optional: Point multiplier (default: 1)
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
  passAddress, // PublicKey of the pass
  pointsToReduce, // Number of points to reduce
  passSigner, // Pass signer from issueLoyaltyPass
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
//     newTotal: number,
//     signature?: string
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
  passAddress, // PublicKey of the pass
  toAddress, // PublicKey of the new owner
)
```

### Query Methods

```typescript
// Get all loyalty passes owned by a wallet
const passes = await getWalletLoyaltyPasses(
  context,
  walletAddress, // PublicKey of the wallet
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

## Error Handling

The protocol uses descriptive error messages. Always wrap calls in try-catch:

```typescript
try {
  await issueLoyaltyPass(context, collectionAddress, recipient, name, uri)
} catch (error) {
  console.error(`Failed to issue pass: ${error}`)
}
```

## License

MIT
