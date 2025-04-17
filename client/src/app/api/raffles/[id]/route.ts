import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const raffle = await prisma.raffle.findUnique({
      where: { id },
      include: {
        winners: true,
      },
    })

    if (!raffle) {
      return NextResponse.json({ error: 'Raffle not found' }, { status: 404 })
    }

    return NextResponse.json(raffle)
  } catch (error) {
    console.error('Error fetching raffle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
