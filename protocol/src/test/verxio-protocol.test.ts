import { keypairIdentity } from "@metaplex-foundation/umi";
import { fromWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters';
import { publicKey } from "@metaplex-foundation/umi";
import { Keypair } from '@solana/web3.js';
import { beforeAll, describe, expect, it } from 'vitest'

import { FIXTURE_FEE_PAYER } from "./fixtures/fee-payer";
import { createTestLoyaltyProgram } from "./helpers/create-test-loyalty-program";
import { getVerxioContext } from "./helpers/get-verxio-context";

const feePayerSolana = Keypair.fromSecretKey(Uint8Array.from(FIXTURE_FEE_PAYER))
const feePayerUmi = fromWeb3JsKeypair(feePayerSolana)
const programAuthority = publicKey(feePayerSolana.publicKey.toBase58())

describe('verxio protocol', () => {
    beforeAll(() => {
        // here we can run any global setup code we might need
    })

    it('should create a new VerxioProtocol instance', () => {
        // ARRANGE
        // ACT
        const ctx = getVerxioContext({ programAuthority });
        // ASSERT
        expect(ctx).toBeDefined();
    });

    it('should create a new loyalty program', async () => {
        // ARRANGE
        const ctx = getVerxioContext({ programAuthority });
        ctx.umi.use(keypairIdentity(feePayerUmi));

        // ACT
        const result = await createTestLoyaltyProgram(ctx);

        // ASSERT
        expect(result).toBeTruthy();
        expect(result.signer).toBeTruthy();
        expect(result.signature).toBeTruthy();
    })
})