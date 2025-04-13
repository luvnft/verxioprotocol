import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface Program {
  publicKey: string
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const creator = searchParams.get('creator')

    if (!creator) {
      return NextResponse.json({ error: 'Creator address is required' }, { status: 400 })
    }

    // Get all programs created by the user
    const programs = await prisma.loyaltyProgram.findMany({
      where: { creator },
      select: { publicKey: true },
    })

    const programAddresses = programs.map((program: Program) => program.publicKey)

    // Get all loyalty passes for these programs
    const passes = await prisma.loyaltyPass.findMany({
      where: {
        collection: {
          in: programAddresses,
        },
      },
      select: {
        recipient: true,
        collection: true,
      },
    })

    // Calculate statistics
    const totalPrograms = programs.length
    const activePasses = passes.length
    const uniqueHolders = new Set(passes.map((pass) => pass.recipient)).size

    return NextResponse.json({
      totalPrograms,
      activePasses,
      totalMembers: uniqueHolders,
      totalPoints: 0, // Will be updated later
    })
  } catch (error) {
    console.error('Error fetching program stats:', error)
    return NextResponse.json({ error: 'Failed to fetch program statistics' }, { status: 500 })
  }
}
