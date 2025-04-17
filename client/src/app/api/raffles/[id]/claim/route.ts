import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { passPublicKey } = await req.json()

    // Find the winner
    const winner = await prisma.raffleWinner.findFirst({
      where: {
        raffleId: params.id,
        passPublicKey,
        claimed: false
      },
      include: {
        raffle: true
      }
    })

    if (!winner) {
      return NextResponse.json({ error: 'Winner not found or prize already claimed' }, { status: 404 })
    }

    // Update winner status
    await prisma.raffleWinner.update({
      where: { id: winner.id },
      data: {
        claimed: true,
        claimedAt: new Date()
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error claiming prize:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 