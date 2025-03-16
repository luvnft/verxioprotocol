import {initializeVerxio, VerxioContext} from "@/core";
import {Network} from "@/types";
import {PublicKey} from "@solana/web3.js";

export function getVerxioContext({ programAuthority } : { programAuthority: PublicKey }): VerxioContext {
    const network: Network = 'devnet'

    return initializeVerxio(network, programAuthority);
}
