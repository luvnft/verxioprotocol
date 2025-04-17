import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { CreateRaffleData, RaffleFilter } from '@/types/raffle'


export async function POST(req: Request) {
  try {
    const data: CreateRaffleData = await req.json()
    
    // Validate dates
    const now = new Date()
    if (new Date(data.startDate) < now) {
      return NextResponse.json({ error: 'Start date must be in the future' }, { status: 400 })
    }
    if (new Date(data.endDate) <= new Date(data.startDate)) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 })
    }
    if (new Date(data.drawDate) <= new Date(data.endDate)) {
      return NextResponse.json({ error: 'Draw date must be after end date' }, { status: 400 })
    }
    const raffle = await prisma.raffle.create({
      data: {
        name: data.name,
        description: data.description,
        prizeType: data.prizeType,
        prizeDetails: data.prizeDetails as any, // Cast to any to satisfy Prisma's Json type
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        drawDate: new Date(data.drawDate),
        status: data.status || 'UPCOMING',
        entryCost: data.entryCost,
        minTier: data.minTier,
        numWinners: data.numWinners,
        programAddress: data.programAddress,
        creator: data.creator || '',
      }
    })

    return NextResponse.json(raffle)
  } catch (error) {
    console.error('Error creating raffle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') as RaffleFilter['status']
    const programId = searchParams.get('programId')
    const creator = searchParams.get('creator')

    const filter: RaffleFilter = {}
    if (status) filter.status = status
    if (programId) filter.programId = programId
    if (creator) filter.creator = creator

    const raffles = await prisma.raffle.findMany({
      where: filter,
      include: {
        winners: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get eligible participants count for each raffle
    const rafflesWithParticipants = await Promise.all(
      raffles.map(async (raffle) => {
        const passes = await prisma.loyaltyPass.findMany({
          where: {
            collection: raffle.programAddress,
            ...(raffle.minTier ? { tier: { gte: raffle.minTier } } : {})
          }
        })
        return {
          ...raffle,
          eligibleParticipants: passes.length
        }
      })
    )

    return NextResponse.json(rafflesWithParticipants)
  } catch (error) {
    console.error('Error fetching raffles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 