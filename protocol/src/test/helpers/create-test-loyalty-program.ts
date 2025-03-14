import { createLoyaltyProgram, VerxioContext } from "@/core";

export async function createTestLoyaltyProgram(context: VerxioContext) {
    return await createLoyaltyProgram(context,{
        organizationName: "My Loyalty Program",
        metadataUri: "https://arweave.net/123abc",
        tiers: [
            { name: "Grind", xpRequired: 0, rewards: ["nothing for you!"] },
            { name: "Bronze", xpRequired: 500, rewards: ["2% cashback"] },
            { name: "Silver", xpRequired: 1000, rewards: ["5% cashback"] },
            { name: "Gold", xpRequired: 2000, rewards: ["10% cashback"] },
        ],
        pointsPerAction: { swap: 600, refer: 1000, stake: 2000 },
    });
}
