import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createServerProgram, Network } from '@/lib/methods/serverProgram'
import { getProgramDetails } from '@verxioprotocol/core'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const creator = searchParams.get('creator')
    const network = searchParams.get('network')

    if (!creator) {
      return NextResponse.json({ error: 'Creator address is required' }, { status: 400 })
    }

    if (!network) {
      return NextResponse.json({ error: 'Network is required' }, { status: 400 })
    }

    // First, get programs from database where the creator is the program authority
    const dbPrograms = await prisma.loyaltyProgram.findMany({
      where: {
        creator: creator,
        network: network,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Then fetch program details for each program
    const programsWithDetails = await Promise.all(
      dbPrograms.map(async (program) => {
        try {
          // Create server context for this program with the correct network
          const context = createServerProgram(program.creator, program.publicKey, network as Network)

          // Get program details using the context
          const details = await getProgramDetails(context)

          return {
            details,
          }
        } catch (error) {
          console.error(`Error fetching details for program ${program.publicKey}:`, error)
          return program // Return just the database data if fetching details fails
        }
      }),
    )

    return NextResponse.json(programsWithDetails)
  } catch (error) {
    console.error('Error fetching programs:', error)
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 })
  }
}
