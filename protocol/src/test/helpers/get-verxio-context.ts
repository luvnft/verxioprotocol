import { initializeVerxio } from "@/core";
import { VerxioContext } from "@/types";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { type PublicKey } from "@metaplex-foundation/umi";

export function getVerxioContext({ programAuthority }: { programAuthority: PublicKey }): VerxioContext {
    const umi = createUmi('https://api.devnet.solana.com');
    return initializeVerxio(umi, programAuthority);
}
