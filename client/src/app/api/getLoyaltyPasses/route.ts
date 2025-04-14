import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const recipient = searchParams.get('recipient')

    if (!recipient) {
      return NextResponse.json({ error: 'Recipient address is required' }, { status: 400 })
    }

    const loyaltyPasses = await prisma.loyaltyPass.findMany({
      where: {
        recipient: recipient,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(loyaltyPasses)
  } catch (error) {
    console.error('Error fetching loyalty passes:', error)
    return NextResponse.json({ error: 'Failed to fetch loyalty passes' }, { status: 500 })
  }
}
