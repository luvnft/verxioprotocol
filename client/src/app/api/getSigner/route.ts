import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const publicKey = searchParams.get('publicKey')

  if (!publicKey || typeof publicKey !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid publicKey' }, { status: 400 })
  }

  try {
    const pass = await prisma.loyaltyPass.findFirst({
      where: { publicKey },
    })

    if (!pass) {
      return NextResponse.json({ error: 'Loyalty pass not found' }, { status: 404 })
    }

    return NextResponse.json(
      {
        privateKey: pass.privateKey,
        collection: pass.collection,
      },
      { status: 200 },
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
