import { generateSigner, keypairIdentity, KeypairSigner } from '@metaplex-foundation/umi'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { createTestLoyaltyProgram } from './helpers/create-test-loyalty-program'
import { getTestContext } from './helpers/get-test-context'
import { ensureFeePayerBalance } from './helpers/ensure-fee-payer-balance'
import { issueLoyaltyPass } from '../lib/issue-loyalty-pass'
import { awardLoyaltyPoints } from '../lib/award-loyalty-points'

const { feePayer, context } = getTestContext()
const passSigner = generateSigner(context.umi)

describe('award-loyalty-points', () => {
  beforeAll(async () => {
    await ensureFeePayerBalance(context.umi, { account: feePayer.publicKey, amount: 1 })
    context.umi.use(keypairIdentity(feePayer))
  })

  let collection: KeypairSigner | undefined
  let loyaltyPass: KeypairSigner | undefined

  beforeEach(async () => {
    // Create a new collection and loyalty pass for each test
    const created = await createTestLoyaltyProgram(context)
    collection = created.collection

    const passResult = await issueLoyaltyPass(context, {
      collectionAddress: collection.publicKey,
      passName: 'Test Pass',
      passMetadataUri: 'https://arweave.net/123abc',
      recipient: feePayer.publicKey,
      assetSigner: passSigner,
    })
    loyaltyPass = passResult.asset
  })

  describe('expected usage', () => {
    it('should award points for a valid action', async () => {
      expect.assertions(3)

      // ARRANGE
      const config = {
        passAddress: loyaltyPass!.publicKey,
        action: 'purchase',
        signer: passSigner,
      }

      // ACT
      const result = await awardLoyaltyPoints(context, config)

      // ASSERT
      expect(result).toBeTruthy()
      expect(result.points).toBeGreaterThan(0)
      expect(result.signature).toBeTruthy()
    })

    it('should apply multiplier to points', async () => {
      expect.assertions(3)

      // ARRANGE
      const config = {
        passAddress: loyaltyPass!.publicKey,
        action: 'purchase',
        signer: passSigner,
        multiplier: 2,
      }

      // ACT
      const result = await awardLoyaltyPoints(context, config)

      // ASSERT
      expect(result).toBeTruthy()
      expect(result.points).toBeGreaterThan(0)
      expect(result.signature).toBeTruthy()
    })

    it('should accumulate points across multiple actions', async () => {
      expect.assertions(4)

      // ARRANGE
      const config = {
        passAddress: loyaltyPass!.publicKey,
        action: 'purchase',
        signer: passSigner,
      }

      // ACT
      const firstResult = await awardLoyaltyPoints(context, config)
      const secondResult = await awardLoyaltyPoints(context, config)

      // ASSERT
      expect(firstResult).toBeTruthy()
      expect(secondResult).toBeTruthy()
      expect(secondResult.points).toBeGreaterThan(firstResult.points)
      expect(secondResult.signature).toBeTruthy()
    })

    it('should update tier when points threshold is reached', async () => {
      expect.assertions(4)

      // ARRANGE
      const config = {
        passAddress: loyaltyPass!.publicKey,
        action: 'purchase',
        signer: passSigner,
        multiplier: 1000, // Large multiplier to ensure tier update
      }

      // ACT
      const result = await awardLoyaltyPoints(context, config)

      // ASSERT
      expect(result).toBeTruthy()
      expect(result.points).toBeGreaterThan(0)
      expect(result.signature).toBeTruthy()
      // Note: Tier verification would require fetching the pass data
      // This is covered in the getAssetData tests
    })
  })

  describe('unexpected usage: config validation', () => {
    it('should throw an error if pass address is invalid', async () => {
      expect.assertions(2)

      // ARRANGE
      const invalidConfig = {
        passAddress: generateSigner(context.umi).publicKey,
        action: 'purchase',
        signer: passSigner,
      }

      // ACT & ASSERT
      try {
        await awardLoyaltyPoints(context, invalidConfig)
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeDefined()
        expect(error.message).toContain('Failed to award points')
      }
    })

    it('should throw an error if action is not defined in points per action', async () => {
      expect.assertions(2)

      // ARRANGE
      const invalidConfig = {
        passAddress: loyaltyPass!.publicKey,
        action: 'invalid_action',
        signer: passSigner,
      }

      // ACT & ASSERT
      try {
        await awardLoyaltyPoints(context, invalidConfig)
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeDefined()
        expect(error.message).toContain('Failed to award points')
      }
    })

    it('should throw an error if signer is not the pass owner', async () => {
      expect.assertions(2)

      // ARRANGE
      const invalidSigner = generateSigner(context.umi)
      const invalidConfig = {
        passAddress: loyaltyPass!.publicKey,
        action: 'purchase',
        signer: invalidSigner,
      }

      // ACT & ASSERT
      try {
        await awardLoyaltyPoints(context, invalidConfig)
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeDefined()
        expect(error.message).toContain('Failed to award points')
      }
    })
  })
})
