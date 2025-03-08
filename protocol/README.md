# Verxio Protocol

A protocol for creating and managing loyalty programs on Solana using MPL Core.

## Features

- Create loyalty programs with custom tiers and rewards
- Issue loyalty passes as NFTs
- Track user XP and tier progression
- Support for transferable loyalty passes (with organization approval)
- Automatic wallet and network handling
- Built-in support for multiple networks (Solana, Sonic)

## Installation

```bash
npm install verxio-protocol
# or
yarn add verxio-protocol
```

## Usage

### Initialize Protocol

```typescript
import { VerxioProtocol } from 'verxio-protocol';
import { PublicKey } from '@solana/web3.js';
import { WalletAdapter } from '@solana/wallet-adapter-base';

// Initialize protocol with wallet
const verxio = new VerxioProtocol(
  'devnet', // Network: 'devnet' | 'mainnet' | 'sonic-mainnet' | 'sonic-testnet'
  new PublicKey('PROGRAM_AUTHORITY'), // Program authority public key
  walletAdapter, // Optional: Wallet adapter for transactions
  'CUSTOM_RPC_URL' // Optional: Custom RPC URL
);

// Update user wallet
verxio.setUserWallet(newWalletAdapter);
```

### Create Loyalty Program

```typescript
const program = await verxio.createProgram({
  organizationName: "Coffee Rewards",
  metadataUri: "https://arweave.net/...",
  tiers: [
    {
      name: "Bronze",
      xpRequired: 500,
      rewards: ["2% cashback"]
    },
    {
      name: "Silver",
      xpRequired: 1000,
      rewards: ["5% cashback"]
    }
  ],
  pointsPerAction: {
    "purchase": 100,
    "review": 50
  }
});

console.log(program);
// {
//   programId: string,      // Collection address
//   signature: string,      // Transaction signature
//   collectionPrivateKey: string  // Collection signer private key
// }
```

### Issue Loyalty Pass

```typescript
const pass = await verxio.issueLoyaltyPass(
  new PublicKey('RECIPIENT_ADDRESS'),
  "Coffee Rewards Pass",
  "https://arweave.net/..."
);

console.log(pass);
// {
//   signer: ReturnType<typeof generateSigner>,  // Pass signer
//   signature: string                           // Transaction signature
// }
```

### Award Points

```typescript
const result = await verxio.awardPoints(
  new PublicKey('PASS_ADDRESS'),
  "purchase",           // Action name
  passSigner,          // Pass signer from issueLoyaltyPass
  2                    // Optional: Point multiplier (default: 1)
);

console.log(result);
// {
//   points: number,    // New total points
//   signature: string  // Transaction signature
// }
```

### Get Pass Data

```typescript
const data = await verxio.getAssetData(new PublicKey('PASS_ADDRESS'));

console.log(data);
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

### Transfer Pass

```typescript
await verxio.approveTransfer(
  new PublicKey('PASS_ADDRESS'),
  new PublicKey('NEW_OWNER_ADDRESS')
);
```

### Query Methods

```typescript
// Get all loyalty passes owned by a wallet
const passes = await verxio.getWalletLoyaltyPasses(
  new PublicKey('WALLET_ADDRESS')
);

// Get program's points per action
const pointsPerAction = await verxio.getPointsPerAction();
// Returns: Record<string, number>

// Get program's tiers
const tiers = await verxio.getProgramTiers();
// Returns: Array<{
//   name: string,
//   xpRequired: number,
//   rewards: string[]
// }>
```

## Network Support

The protocol supports multiple networks out of the box:

```typescript
const NETWORKS = {
  mainnet: "https://api.mainnet-beta.solana.com",
  devnet: "https://api.devnet.solana.com",
  "sonic-mainnet": "https://api.mainnet-alpha.sonic.game",
  "sonic-testnet": "https://api.testnet.sonic.game"
};
```

You can also provide a custom RPC URL during initialization.

## Error Handling

The protocol uses descriptive error messages. Always wrap calls in try-catch:

```typescript
try {
  await verxio.issueLoyaltyPass(recipient, name, uri);
} catch (error) {
  console.error(`Failed to issue pass: ${error}`);
}
```

## License

MIT
