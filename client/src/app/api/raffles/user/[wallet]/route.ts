import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: { wallet: string } }) {
  try {
    // Get all raffles where the user's loyalty pass is eligible
    const passes = await prisma.loyaltyPass.findMany({
      where: {
        recipient: params.wallet,
      },
    })

    // Get all raffles for the programs the user has passes for
    const raffles = await prisma.raffle.findMany({
      where: {
        programAddress: {
          in: passes.map((pass) => pass.collection),
        },
      },
      include: {
        winners: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Get eligible participants count for each raffle
    const rafflesWithParticipants = await Promise.all(
      raffles.map(async (raffle) => {
        const eligiblePasses = await prisma.loyaltyPass.findMany({
          where: {
            collection: raffle.programAddress,
            ...(raffle.minTier ? { tier: { gte: raffle.minTier } } : {}),
          },
        })
        return {
          ...raffle,
          eligibleParticipants: eligiblePasses.length,
        }
      }),
    )

    return NextResponse.json(rafflesWithParticipants)
  } catch (error) {
    console.error('Error fetching user raffles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
