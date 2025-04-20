import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createServerProgram, Network } from '@/lib/methods/serverProgram'
import { getAssetData } from '@verxioprotocol/core'
import { publicKey } from '@metaplex-foundation/umi'
import { getImageFromMetadata } from '@/lib/getImageFromMetadata'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const recipient = searchParams.get('recipient')
    const network = searchParams.get('network') as Network

    if (!recipient) {
      return NextResponse.json({ error: 'Recipient address is required' }, { status: 400 })
    }

    if (!network) {
      return NextResponse.json({ error: 'Network is required' }, { status: 400 })
    }

    // First, get passes from database
    const dbPasses = await prisma.loyaltyPass.findMany({
      where: {
        recipient: recipient,
        network: network,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Then fetch asset data for each pass
    const passesWithDetails = await Promise.all(
      dbPasses.map(async (pass) => {
        try {
          // Create server context for this pass
          const context = createServerProgram(pass.recipient, pass.publicKey, network)

          const details = await getAssetData(context, publicKey(pass.publicKey))
          const bannerImage = details ? await getImageFromMetadata(details.uri) : null

          return {
            details,
            bannerImage,
          }
        } catch (error) {
          console.error(`Error fetching details for pass ${pass.publicKey}:`, error)
          return pass // Return just the database data if fetching details fails
        }
      }),
    )

    return NextResponse.json(passesWithDetails)
  } catch (error) {
    console.error('Error fetching loyalty passes:', error)
    return NextResponse.json({ error: 'Failed to fetch loyalty passes' }, { status: 500 })
  }
}
