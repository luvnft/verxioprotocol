import { NextResponse } from 'next/server'
import { createServerProgram } from '@/lib/methods/serverProgram'
import { getAssetData } from '@verxioprotocol/core'
import { getProgramNetwork } from '@/lib/methods/getProgramNetwork'
import { Network } from '@/lib/methods/serverProgram'
import prisma from '@/lib/prisma'
import { publicKey } from '@metaplex-foundation/umi'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const passId = searchParams.get('passId')

    if (!passId) {
      return NextResponse.json({ error: 'Pass ID is required' }, { status: 400 })
    }

    // Get the pass details from our database
    const pass = await prisma.loyaltyPass.findFirst({
      where: {
        publicKey: passId,
      },
    })

    if (!pass) {
      return NextResponse.json({ error: 'Pass not found' }, { status: 404 })
    }

    // Get the program's network from the database
    const network = await getProgramNetwork(pass.collection)
    if (!network) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    }

    // Create server context for this program
    const context = createServerProgram(
      pass.collection, // Using collection as both authority and collection address
      pass.collection,
      network as Network,
    )

    // Get pass details using the context
    const details = await getAssetData(context, publicKey(passId))

    return NextResponse.json({ ...details, network })
  } catch (error) {
    console.error('Error fetching pass details:', error)
    return NextResponse.json({ error: 'Failed to fetch pass details' }, { status: 500 })
  }
}
