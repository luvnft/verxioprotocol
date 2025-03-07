import { VerxioProtocol } from "./core";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";
import { keypairIdentity } from "@metaplex-foundation/umi";
import { fromWeb3JsKeypair } from "@metaplex-foundation/umi-web3js-adapters";
import bs58 from "bs58";
import { config } from "dotenv";

config();

async function testNewProgramCreation() {
  // Decode the private key from base58
  const privateKey = bs58.decode(process.env.KEY!);
  const solanaKeypair = Keypair.fromSecretKey(privateKey);
  const umiKeypair = fromWeb3JsKeypair(solanaKeypair);

  const authorityKey = new PublicKey(
    "FFvPUNGYsQa4vjLAcCJ4zx8vZ4BSqQoCbMMyG3VNuEnd"
  );

  console.log("\n=== Testing New Program Creation ===\n");

  const verxio = new VerxioProtocol({
    network: "sonic-testnet",
    programAuthority: authorityKey,
    organizationName: "Jupiter Exchange",
    passMetadataUri: "https://arweave.net/123abc",
  });

  verxio.umi.use(keypairIdentity(umiKeypair));

  try {
    console.log("1. Creating loyalty program...");
    const programResult = await verxio.createProgram({
      organizationName: "Jupiter Exchange",
      metadataUri: "https://arweave.net/123abc",

      tiers: [
        {
          name: "Grind",
          xpRequired: 0,
          rewards: ["nothing for you!"],
        },
        {
          name: "Bronze",
          xpRequired: 500,
          rewards: ["2% cashback"],
        },
        {
          name: "Silver",
          xpRequired: 1000,
          rewards: ["5% cashback"],
        },
        {
          name: "Gold",
          xpRequired: 2000,
          rewards: ["10% cashback"],
        },
      ],
      pointsPerAction: {
        swap: 600,
        refer: 1000,
        stake: 2000,
      },
    });

    console.log("Program created:", programResult);

    // Generate a test user wallet
    const testUser = Keypair.generate();
    console.log("Test user public key:", testUser.publicKey.toString());

    console.log("\n2. Issuing loyalty pass...");
    const passResult = await verxio.issueLoyaltyPass(testUser.publicKey);
    const passAddress = new PublicKey(passResult.signer.publicKey);
    console.log("Loyalty pass issued:", passResult);

    const programActions = await verxio.getPointsPerAction();
    console.log("Program Actions and Points:");
    console.table(programActions);

    const programTiers = await verxio.getProgramTiers();
    console.log("\nProgram Tiers and Requirements:");
    console.table(programTiers);
   

    console.log("\n3. Testing point awards...");
    // Award points for different actions
    const swapPoints = await verxio.awardPoints(
      passAddress,
      "swap",
      passResult.signer
    );
    console.log("Points after swap:", swapPoints);

    const stakePoints = await verxio.awardPoints(
      passAddress,
      "stake",
      passResult.signer
    );
    console.log("Points after stake:", stakePoints);

    const referPoints = await verxio.awardPoints(
      passAddress,
      "refer",
      passResult.signer
    );
    console.log("Points after refer:", referPoints);

    // Add a small delay to ensure the last transaction is confirmed
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Now fetch the asset data
    const assetData = await verxio.getAssetData(passAddress);
      console.log("Final Asset Data:", assetData);

    // const tx = await verxio.approveTransfer(
    //   passAddress,
    //   new PublicKey("6WdSAAE49mp7bxKScXDNV41zX1Uk9bCTg6QeaV6YkToy")
    // );
    // console.log("Transfer approved and executed");
    // console.log("Transaction:", tx);


    // Test fetching wallet's loyalty passes
    console.log("\n4. Testing wallet loyalty passes fetch...");
    const walletPasses = await verxio.getWalletLoyaltyPasses(
     testUser.publicKey
    );
    console.log("Wallet Loyalty Passes:", walletPasses);

    return "programResult, testUser, passAddress";
  } catch (error) {
    console.error("Error in new program creation:", error);
    throw error;
  }
}

async function main() {
  try {
    // First test: Create new program and issue pass
    await testNewProgramCreation();
    console.log("Transaction successful");
  } catch (error) {
    console.error("Error in main:", error);
  }
}

main();
