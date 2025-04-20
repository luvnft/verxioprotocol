import { NextResponse } from 'next/server'
import { createServerProgram } from '@/lib/methods/serverProgram'
import { getProgramDetails } from '@verxioprotocol/core'
import { getProgramNetwork } from '@/lib/methods/getProgramNetwork'
import { Network } from '@/lib/methods/serverProgram'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const programId = searchParams.get('programId')

    if (!programId) {
      return NextResponse.json({ error: 'Program ID is required' }, { status: 400 })
    }

    // Get the program's network from the database
    const network = await getProgramNetwork(programId)
    if (!network) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    }

    // Create server context for this program
    const context = createServerProgram(
      programId, // Using programId as both authority and collection address
      programId,
      network as Network,
    )

    // Get program details using the context
    const details = await getProgramDetails(context)

    return NextResponse.json({ ...details, network })
  } catch (error) {
    console.error('Error fetching program details:', error)
    return NextResponse.json({ error: 'Failed to fetch program details' }, { status: 500 })
  }
}
