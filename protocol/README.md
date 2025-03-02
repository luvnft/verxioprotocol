# Verxio Protocol

Verxio is a decentralized loyalty protocol that enables organizations to create and manage NFT-based loyalty programs with experience points (XP) on Solana. The protocol leverages Metaplex's MPL Core standard to provide secure, on-chain loyalty tracking and rewards that can be redeemed in both digital and real-world marketplaces.

## Features

- - 🏆 **Customizable Loyalty Programs**: Organizations can define their own tiers, rewards, and 
point systems
- 🎯 **NFT-Based Loyalty Passes**: Issue unique NFTs that track user progress and rewards
- 🏆 **Dynamic XP System**: Award experience points for various user actions
- 📈 **Automatic Tier Progression**: Users automatically level up based on XP milestones
- 🔒 **Secure Transfer System**: Managed token transfers with organization verification
- ⚡ **Flexible Integration**: Easy integration with existing platforms and dApps
- 🌐 **Cross-Platform Compatibility**: XP and achievements are tracked across different platforms

## Installation

```bash
npm install @verxio/protocol
```

## Usage

```typescript
// Import the protocol
import VerxioProtocol from '@verxio/protocol';

// Or import with types
import { VerxioProtocol, LoyaltyProgramData } from '@verxio/protocol';

// Initialize the protocol
const verxio = new VerxioProtocol({
  umi: umiConnection,
  programAuthority: publicKey,
  organizationName: "Jupiter Exchange",
  passMetadataUri: "https://..."
});

// Create a loyalty program
const programId = await verxio.createProgram({
  organizationName: "Jupiter Exchange",
  metadataUri: "https://...",
  symbol: "JUP",
  tiers: [
    { 
      name: "Bronze", 
      xpRequired: 500, 
      rewards: ["2% cashback"] 
    },
    { 
      name: "Silver", 
      xpRequired: 1000, 
      rewards: ["5% cashback", "Priority support"] 
    }
  ],
  pointsPerAction: {
    "swap": 10,
    "referral": 50,
    "dailyLogin": 5
  }
});

// Issue a loyalty pass
const userPass = await verxio.issueLoyaltyPass(userPublicKey);

// Award points
const newXp = await verxio.awardPoints(userPass, "swap");
```

## Quick Start

```typescript
import { LoyaltyProgram } from '@verxio/protocol';
import { createUmi } from '@metaplex-foundation/umi';

// Initialize the Umi connection
const umi = createUmi('https://api.mainnet-beta.solana.com');

// Initialize the loyalty program
const program = new LoyaltyProgram({
  umi,
  programAuthority: publicKey, // Your program's authority
  organizationName: "Jupiter Exchange",
  passMetadataUri: "https://arweave.net/..." // URI for loyalty pass metadata
});

// Define your loyalty program structure
const loyaltyProgramData = {
  organizationName: "Jupiter Exchange",
  metadataUri: "https://arweave.net/...", // URI for program metadata
  symbol: "JUP",
  tiers: [
    {
      name: "Bronze",
      xpRequired: 500,
      rewards: ["2% cashback"]
    },
    {
      name: "Silver",
      xpRequired: 1000,
      rewards: ["5% cashback", "Priority support"]
    },
    {
      name: "Gold",
      xpRequired: 2500,
      rewards: ["10% cashback", "VIP access", "Exclusive NFTs"]
    }
  ],
  pointsPerAction: {
    "swap": 10,
    "referral": 50,
    "dailyLogin": 5,
    "stake": 25
  }
};

// Create a new loyalty program
const programId = await program.createProgram(loyaltyProgramData);

// Issue a loyalty pass to a user
const userPass = await program.issueLoyaltyPass(userPublicKey);

// Award points for user actions
const newXp = await program.awardPoints(userPass, "swap"); // Basic points
const bonusXp = await program.awardPoints(userPass, "referral", 2); // With 2x multiplier
```

## Core Components

### 1. Loyalty Program Creation
The `createProgram` method sets up your loyalty program with:
- NFT collection for loyalty passes
- Tier structure and requirements
- Points system configuration
- Transfer delegation settings

```typescript
const programId = await program.createProgram({
  organizationName: string;
  metadataUri: string;
  symbol?: string;
  tiers: Tier[];
  pointsPerAction: PointAction;
});
```

### 2. Loyalty Pass Issuance
Issue NFT-based loyalty passes to users that track:
- Current XP balance
- Tier status
- Action history
- Timestamps

```typescript
const userPass = await program.issueLoyaltyPass(userPublicKey);
```

### 3. Points Management
Award XP for user actions with optional multipliers:

```typescript
const newXp = await program.awardPoints(
  passAddress: PublicKey, 
  action: string,
  multiplier?: number
);
```

## Data Structures

### LoyaltyProgramData
```typescript
interface LoyaltyProgramData {
  organizationName: string;
  metadataUri: string;
  symbol?: string;
  tiers: Tier[];
  pointsPerAction: PointAction;
}
```

### Tier
```typescript
interface Tier {
  name: string;
  xpRequired: number;
  rewards: string[];
}
```

### PointAction
```typescript
interface PointAction {
  [key: string]: number;
}
```

## Implementation Guide

### 1. Setting Up Points System
Design your points system carefully:
- Define meaningful actions that align with user engagement
- Set appropriate point values for each action
- Use multipliers for special events or promotions

```typescript
const pointsPerAction = {
  "trade": 10,        // Basic trading activity
  "stake": 25,        // Staking tokens
  "referral": 50,     // Referring new users
  "dailyLogin": 5,    // Daily engagement
  "eventParticipation": 30  // Special events
};
```

### 2. Tier Structure Design
Create engaging progression paths:
- Set achievable tier thresholds
- Offer meaningful rewards at each tier
- Consider time-based requirements

```typescript
const tiers = [
  {
    name: "Bronze",
    xpRequired: 500,
    rewards: ["Basic rewards"]
  },
  {
    name: "Silver",
    xpRequired: 1500,
    rewards: ["Enhanced rewards", "Special access"]
  },
  {
    name: "Gold",
    xpRequired: 5000,
    rewards: ["Premium benefits", "Exclusive features"]
  }
];
```

## Best Practices

1. **XP System Design**
   - Keep point values balanced and inflation-resistant
   - Use multipliers strategically for special events
   - Implement rate limiting for point awards

2. **Security Considerations**
   - Always verify user actions before awarding points
   - Monitor for unusual activity patterns
   - Implement proper access controls

3. **User Experience**
   - Provide clear feedback on XP earnings
   - Make tier progression visible and exciting
   - Ensure rewards are easily accessible

## Support & Resources

- Documentation: [docs.verxio.xyz](https://docs.verxio.xyz)
- Discord: [Join our community](https://discord.gg/verxio)
- Twitter: [@VerxioProtocol](https://x.com/verxioprotocol)

## License

MIT License - see [LICENSE](LICENSE) for details.