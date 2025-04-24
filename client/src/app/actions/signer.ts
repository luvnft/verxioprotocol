'use server'

import prisma from '@/lib/prisma'
import { cache } from 'react'

export const getSigner = cache(async (publicKey: string) => {
  try {
    if (!publicKey) {
      throw new Error('Missing or invalid publicKey')
    }

    const pass = await prisma.loyaltyPass.findFirst({
      where: { publicKey },
    })

    if (!pass) {
      throw new Error('Loyalty pass not found')
    }

    return {
      privateKey: pass.privateKey,
      collection: pass.collection,
    }
  } catch (error) {
    console.error('Error getting signer:', error)
    throw new Error('Failed to get signer')
  }
})
