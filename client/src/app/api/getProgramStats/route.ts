import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createServerProgram, Network } from '@/lib/methods/serverProgram'
import { getAssetData } from '@verxioprotocol/core'
import { publicKey } from '@metaplex-foundation/umi'

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

    // Get all programs created by the user
    const programs = await prisma.loyaltyProgram.findMany({
      where: {
        creator: creator,
        network: network,
      },
      select: {
        publicKey: true,
      },
    })

    // Get all passes associated with these programs
    const passes = await prisma.loyaltyPass.findMany({
      where: {
        collection: {
          in: programs.map((program: { publicKey: string }) => program.publicKey),
        },
        network: network,
      },
      select: {
        recipient: true,
        publicKey: true,
      },
    })

    // Calculate basic statistics
    const totalPrograms = programs.length
    const activePasses = passes.length
    const uniqueHolders = new Set(passes.map((pass: { recipient: string }) => pass.recipient)).size

    // Calculate total XP from all passes
    let totalPoints = 0
    const passesWithXP = await Promise.all(
      passes.map(async (pass) => {
        try {
          const context = createServerProgram(creator, pass.publicKey, network as Network)
          const details = await getAssetData(context, publicKey(pass.publicKey))
          return details?.xp || 0
        } catch (error) {
          console.error(`Error fetching XP for pass ${pass.publicKey}:`, error)
          return 0
        }
      }),
    )
    totalPoints = passesWithXP.reduce((sum, xp) => sum + xp, 0)

    // Format total points
    const formatStat = (points: number): string => {
      if (points >= 1000000) {
        const millions = points / 1000000
        return `${millions.toFixed(1)} million`
      } else if (points >= 1000) {
        return points.toLocaleString()
      }
      return points.toString()
    }

    return NextResponse.json({
      totalPrograms: formatStat(totalPrograms),
      activePasses: formatStat(activePasses),
      totalMembers: formatStat(uniqueHolders),
      totalPoints: formatStat(totalPoints),
    })
  } catch (error) {
    console.error('Error fetching program stats:', error)
    return NextResponse.json({ error: 'Failed to fetch program stats' }, { status: 500 })
  }
}
