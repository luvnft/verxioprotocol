import { generateSigner, keypairIdentity, KeypairSigner } from '@metaplex-foundation/umi'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { createTestLoyaltyProgram } from './helpers/create-test-loyalty-program'
import { getTestContext } from './helpers/get-test-context'
import { ensureFeePayerBalance } from './helpers/ensure-fee-payer-balance'
import { getPointsPerAction } from '../lib/get-points-per-action'

const { feePayer, context } = getTestContext()

describe('get-points-per-action', () => {
  beforeAll(async () => {
    await ensureFeePayerBalance(context.umi, { account: feePayer.publicKey, amount: 1 })
    context.umi.use(keypairIdentity(feePayer))
  })

  let collection: KeypairSigner | undefined

  beforeEach(async () => {
    // Create a new collection for each test
    const created = await createTestLoyaltyProgram(context)
    collection = created.collection
    context.collectionAddress = collection.publicKey
  })

  describe('expected usage', () => {
    it('should return points per action configuration', async () => {
      expect.assertions(2)
      if (!collection) throw new Error('Test setup failed')

      // ACT
      const pointsPerAction = await getPointsPerAction(context)

      // ASSERT
      expect(pointsPerAction).toBeDefined()
      expect(typeof pointsPerAction).toBe('object')
    })
  })

  describe('unexpected usage', () => {
    it('should throw an error if collection address is not set', async () => {
      expect.assertions(2)
      if (!collection) throw new Error('Test setup failed')

      // ARRANGE
      const invalidContext = { ...context, collectionAddress: undefined }

      // ACT & ASSERT
      try {
        await getPointsPerAction(invalidContext)
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeDefined()
        expect(error.message).toContain('Collection not initialized')
      }
    })

    it('should throw an error if collection is not found', async () => {
      expect.assertions(2)
      if (!collection) throw new Error('Test setup failed')

      // ARRANGE
      const invalidContext = { ...context }
      invalidContext.collectionAddress = generateSigner(context.umi).publicKey

      // ACT & ASSERT
      try {
        await getPointsPerAction(invalidContext)
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeDefined()
        expect(error.message).toContain('[AccountNotFoundError] The account of type [CollectionV1] was not found')
      }
    })
  })
})
