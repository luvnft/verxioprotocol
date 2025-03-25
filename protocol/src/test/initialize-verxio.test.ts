import { describe, it, expect } from 'vitest'
import { getTestContext } from './helpers/get-test-context'
import { initializeVerxio } from '../lib/initialize-verxio'

describe('initializeVerxio', () => {
  it('should initialize verxio context with provided umi and program authority', () => {
    // Setup
    const { context: testContext } = getTestContext()

    // Execute
    const context = initializeVerxio(testContext.umi, testContext.programAuthority)

    // Assert
    expect(context.umi).toBe(testContext.umi)
    expect(context.programAuthority).toBe(testContext.programAuthority)
    expect(context.collectionAddress).toBeUndefined()
  })

  it('should return a valid VerxioContext type', () => {
    // Setup
    const { context: testContext } = getTestContext()

    // Execute
    const context = initializeVerxio(testContext.umi, testContext.programAuthority)

    // Assert structure
    expect(context).toHaveProperty('umi')
    expect(context).toHaveProperty('programAuthority')
    expect(Object.keys(context).length).toBeLessThanOrEqual(3) // umi, programAuthority, and optionally collectionAddress
  })
})
