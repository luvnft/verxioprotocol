import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { creator, publicKey, privateKey, signature, network } = await request.json()

    const program = await prisma.loyaltyProgram.create({
      data: {
        creator,
        publicKey,
        privateKey,
        signature,
        network,
      },
    })

    return NextResponse.json(program)
  } catch (error: any) {
    console.error('Detailed error:', error)
    return NextResponse.json({ error: 'Failed to store loyalty program', details: error.message }, { status: 500 })
  }
}
