'use server'

import prisma from '@/lib/prisma'
import { createServerProgram, Network } from '@/lib/methods/serverProgram'
import { getAssetData } from '@verxioprotocol/core'
import { publicKey } from '@metaplex-foundation/umi'
import { getProgramNetwork } from '@/lib/methods/getProgramNetwork'
import { getImageFromMetadata } from '@/lib/getImageFromMetadata'
import { cache } from 'react'

export const getLoyaltyPasses = cache(async (recipient: string, network: string) => {
  try {
    if (!recipient) {
      throw new Error('Recipient address is required')
    }

    if (!network) {
      throw new Error('Network is required')
    }

    // First, get passes from database
    const dbPasses = await prisma.loyaltyPass.findMany({
      where: {
        recipient: recipient,
        network: network as Network,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Then fetch asset data for each pass
    const passesWithDetails = await Promise.all(
      dbPasses.map(async (pass) => {
        try {
          // Create server context for this pass
          const context = createServerProgram(pass.recipient, pass.publicKey, network as Network)
          const details = await getAssetData(context, publicKey(pass.publicKey))
          return { ...pass, details }
        } catch (error) {
          // Silently handle errors and return just the database data
          return pass
        }
      }),
    )

    return passesWithDetails
  } catch (error) {
    console.error('Error fetching loyalty passes:', error)
    throw new Error('Failed to fetch loyalty passes')
  }
})

export const getPassDetails = cache(async (passId: string) => {
  try {
    if (!passId) {
      throw new Error('Pass ID is required')
    }

    // Get the pass details from our database
    const pass = await prisma.loyaltyPass.findFirst({
      where: {
        publicKey: passId,
      },
    })

    if (!pass) {
      throw new Error('Pass not found')
    }

    // Get the program's network from the database
    const network = await getProgramNetwork(pass.collection)
    if (!network) {
      throw new Error('Program not found')
    }

    // Create server context for this program
    const context = createServerProgram(
      pass.collection, // Using collection as both authority and collection address
      pass.collection,
      network as Network,
    )

    // Get pass details using the context
    const details = await getAssetData(context, publicKey(passId))

    return { ...details, network }
  } catch (error) {
    console.error('Error fetching pass details:', error)
    throw new Error('Failed to fetch pass details')
  }
})

export const storeLoyaltyPass = cache(async (data: {
  collection: string
  recipient: string
  publicKey: string
  privateKey: string
  signature: string
  network: string
}) => {
  try {
    const { collection, recipient, publicKey, privateKey, signature, network } = data

    const pass = await prisma.loyaltyPass.create({
      data: {
        collection,
        recipient,
        publicKey,
        privateKey,
        signature,
        network,
      },
    })

    return pass
  } catch (error) {
    console.error('Error storing loyalty pass:', error)
    throw new Error('Failed to store loyalty pass')
  }
}) 