import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const creator = searchParams.get('creator')

    if (!creator) {
      return NextResponse.json({ error: 'Creator address is required' }, { status: 400 })
    }

    const programs = await prisma.loyaltyProgram.findMany({
      where: {
        creator: creator,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(programs)
  } catch (error) {
    console.error('Error fetching programs:', error)
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 })
  }
}
