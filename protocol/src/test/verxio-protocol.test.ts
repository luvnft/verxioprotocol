import { keypairIdentity } from '@metaplex-foundation/umi'
import { fromWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters'
import { publicKey } from '@metaplex-foundation/umi'
import { Keypair } from '@solana/web3.js'
import { beforeAll, describe, expect, it } from 'vitest'

import { FIXTURE_FEE_PAYER } from './fixtures/fee-payer'
import { createTestLoyaltyProgram } from './helpers/create-test-loyalty-program'
import { getVerxioContext } from './helpers/get-verxio-context'

const feePayerSolana = Keypair.fromSecretKey(Uint8Array.from(FIXTURE_FEE_PAYER))
const feePayerUmi = fromWeb3JsKeypair(feePayerSolana)
const programAuthority = publicKey(feePayerSolana.publicKey.toBase58())

describe('verxio protocol', () => {
  beforeAll(() => {
    console.log('Setting up test environment...')
    console.log('Program Authority:', programAuthority.toString())
  })

  it('should create a new VerxioProtocol instance', () => {
    console.log('Creating VerxioProtocol instance...')
    const ctx = getVerxioContext({ programAuthority })
    expect(ctx).toBeDefined()
    console.log('VerxioProtocol instance created successfully')
  })

  it('should create a new loyalty program', async () => {
    try {
      console.log('Starting loyalty program creation test...')
      
      // ARRANGE
      console.log('Setting up context...')
      const ctx = getVerxioContext({ programAuthority })
      ctx.umi.use(keypairIdentity(feePayerUmi))
      console.log('Context setup complete')

      // ACT
      console.log('Creating test loyalty program...')
      const result = await createTestLoyaltyProgram(ctx)
      console.log('Program creation complete')

      // ASSERT
      console.log('Verifying results...')
      expect(result).toBeTruthy()
      expect(result.signer).toBeTruthy()
      expect(result.signature).toBeTruthy()
      console.log('Test completed successfully')
    } catch (error) {
      console.error('Test failed with error:', error)
      throw error
    }
  })
})
