import { VerxioProtocol } from './core';
import { createUmi } from '@metaplex-foundation/umi';
import { publicKey } from '@metaplex-foundation/umi';
import { PublicKey } from '@solana/web3.js';

async function main() {
  // Initialize UMI with web3.js adapter
  const umi = await createUmi();
  
  // Convert string to Solana PublicKey first
  const authorityKey = new PublicKey('YOUR_AUTHORITY_KEY');

  const verxio = new VerxioProtocol({
    umi,
    programAuthority: authorityKey,
    organizationName: "Jupiter Exchange",
    passMetadataUri: "https://..."
  });

  try {
    // Create loyalty program
    const programId = await verxio.createProgram({
      organizationName: "Jupiter Exchange",
      metadataUri: "https://...",
      symbol: "JUP",
      tiers: [
        { 
          name: "Bronze", 
          xpRequired: 500, 
          rewards: ["2% cashback"] 
        }
      ],
      pointsPerAction: {
        "swap": 10
      }
    });

    console.log('Created program:', programId);
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 