# Verxio Protocol

A protocol for creating and managing loyalty programs on Solana using MPL Core.

## Features

- Create loyalty programs with custom tiers and rewards
- Issue loyalty passes as NFTs
- Track user XP and tier progression
- Support for transferable loyalty passes (with organization approval)
- Multiple database adapters (MongoDB, Supabase, Firebase)
- **Inventory management system for tracking user assets**
- **Query methods for loyalty passes and inventories**

## Installation

```bash
npm install verxio-protocol
# or
yarn add verxio-protocol
```

## Usage

### On-Chain Only (No Database Required)
```typescript
// Initialize Verxio without database
const verxio = new VerxioProtocol({
  network: 'devnet',
  programAuthority: new PublicKey('YOUR_AUTHORITY_KEY'),
  organizationName: "Your Organization",
  passMetadataUri: "https://your-metadata-uri.com"
});

// Fetch loyalty pass details from chain
const pass = await verxio.getLoyaltyPassOnChain(passAddress);

// Get pass with token data
const passWithToken = await verxio.getLoyaltyPassWithToken(passAddress);

// Get all passes owned by a wallet
const walletPasses = await verxio.getWalletLoyaltyPasses(walletAddress);

// Get all passes created by an organization
const orgPasses = await verxio.getOrganizationLoyaltyPasses(creatorAddress);
```

### With Database Support
```typescript
// Initialize with database
const verxio = new VerxioProtocol({
  network: 'devnet',
  programAuthority: new PublicKey('YOUR_AUTHORITY_KEY'),
  organizationName: "Your Organization",
  passMetadataUri: "https://your-metadata-uri.com",
  database: {
    type: 'mongodb',
    config: {
      uri: "your-database-uri"
    }
  }
});

// Create a loyalty program
const programId = await verxio.createProgram({
  organizationName: "Your Organization",
  metadataUri: "https://...",
  symbol: "LOYAL",
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
    "purchase": 10,
    "review": 5
  }
});

// Issue loyalty pass to user
const userWallet = new PublicKey('USER_WALLET_ADDRESS');
const passAddress = await verxio.issueLoyaltyPass(userWallet);

// Award points for actions
await verxio.awardPoints(passAddress, "purchase", 2); // With 2x multiplier

// Handle pass transfers
await verxio.requestTransfer(
  passAddress,
  oldOwner,
  newOwner
);

// Organization approves transfer
await verxio.approveTransfer(
  passAddress,
  oldOwner,
  newOwner
);

// Inventory Management
// Create inventory for user
await verxio.createInventory(userId);

// Add NFT to inventory
await verxio.addNFTToInventory(
  userId,
  nftAddress,
  {
    type: 'loyalty-pass',
    programId: programId.toString(),
    xp: 0
  }
);

// Remove NFT from inventory
await verxio.removeNFTFromInventory(userId, nftAddress);

// Get user's inventory
const inventory = await verxio.getInventory(userId);

// Get inventory by wallet address
const walletInventory = await verxio.getWalletInventory(userWallet);

// Check if user has loyalty pass
const hasPass = await verxio.hasLoyaltyPass(userId, programId);

// Get all user's loyalty passes
const passes = await verxio.getUserLoyaltyPasses(userId);
}
```

## Database Support

The protocol supports multiple database backends:

### MongoDB
```typescript
{
  type: 'mongodb',
  config: {
    uri: "mongodb://...",
    options: {}
  }
}
```

### Supabase
```typescript
{
  type: 'supabase',
  config: {
    uri: "https://your-project.supabase.co",
    options: {
      apiKey: "your-api-key"
    }
  }
}
```

### Firebase
```typescript
{
  type: 'firebase',
  config: {
    uri: "your-project-id",
    options: {
      firebaseConfig: {
        // Your Firebase config object
      }
    }
  }
}
```

## Protocol Analytics

```typescript
// Get protocol-wide statistics
const stats = await verxio.getProtocolStats();
console.log(stats);
// {
//   totalPrograms: 100,
//   totalLoyaltyPasses: 5000,
//   totalXPAwarded: 1000000,
//   uniqueUsers: 2500
// }

// Get user's global XP and stats
const userStats = await verxio.getGlobalUserStats(userId);
console.log(userStats);
// {
//   userId: "user123",
//   totalXP: 15000,
//   programsParticipated: 5,
//   loyaltyPasses: 8,
//   lastUpdated: Date
// }

// Get top users by global XP
const topUsers = await verxio.getTopUsers(10);
console.log(topUsers);
// Array of GlobalUserStats sorted by totalXP
```

This implementation:
1. Tracks protocol-wide statistics (programs, passes, XP, users)
2. Maintains global XP balance for users across all programs
3. Allows querying top users by XP
4. Updates stats automatically when relevant actions occur
5. Makes analytics available both with and without database (returns zero values when no database)

Would you like me to add the database adapter implementations for MongoDB, Supabase, and Firebase as well?

## License

MIT
