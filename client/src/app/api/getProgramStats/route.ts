import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const creator = searchParams.get('creator')

    if (!creator) {
      return NextResponse.json({ error: 'Creator address is required' }, { status: 400 })
    }

    // Get all programs created by the user
    const programs = await prisma.loyaltyProgram.findMany({
      where: {
        creator: creator,
      },
      select: {
        publicKey: true,
      },
    })

    // Get all passes associated with these programs
    const passes = await prisma.loyaltyPass.findMany({
      where: {
        collection: {
          in: programs.map((program) => program.publicKey),
        },
      },
      select: {
        recipient: true,
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
    return NextResponse.json({ error: 'Failed to fetch program stats' }, { status: 500 })
  }
}
