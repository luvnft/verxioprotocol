import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { publicKey, privateKey, signature, collection, recipient } = await request.json()

    const pass = await prisma.loyaltyPass.create({
      data: {
        collection,
        recipient,
        publicKey,
        privateKey,
        signature,
      },
    })

    return NextResponse.json(pass)
  } catch (error) {
    console.error('Error storing loyalty pass:', error)
    return NextResponse.json({ error: 'Failed to store loyalty pass' }, { status: 500 })
  }
}
