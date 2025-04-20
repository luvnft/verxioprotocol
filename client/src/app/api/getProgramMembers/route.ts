import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createServerProgram, Network } from '@/lib/methods/serverProgram'
import { getAssetData } from '@verxioprotocol/core'
import { publicKey } from '@metaplex-foundation/umi'

interface MemberPass {
  publicKey: string
  name: string
  xp: number
  lastAction: string | null
  actionHistory: Array<{
    type: string
    points: number
    timestamp: number
    newTotal: number
  }>
  currentTier: string
  tierUpdatedAt: number
  rewards: string[]
}

interface Member {
  address: string
  passes: MemberPass[]
  totalXp: number
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const creator = searchParams.get('creator')
    const network = searchParams.get('network')

    if (!creator) {
      return NextResponse.json({ error: 'Creator address is required' }, { status: 400 })
    }

    if (!network) {
      return NextResponse.json({ error: 'Valid network is required' }, { status: 400 })
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

    // Group passes by recipient
    const passesByRecipient = passes.reduce(
      (acc, pass) => {
        if (!acc[pass.recipient]) {
          acc[pass.recipient] = []
        }
        acc[pass.recipient].push(pass)
        return acc
      },
      {} as Record<string, typeof passes>,
    )

    // Get detailed pass information for each member
    const members: Member[] = await Promise.all(
      Object.entries(passesByRecipient).map(async ([address, memberPasses]) => {
        const passesWithDetails = await Promise.all(
          memberPasses.map(async (pass) => {
            try {
              const context = createServerProgram(creator, pass.publicKey, network as Network)
              const details = await getAssetData(context, publicKey(pass.publicKey))
              if (!details) return null

              return {
                publicKey: pass.publicKey,
                name: details.name,
                xp: details.xp,
                actionHistory: details.actionHistory,
                currentTier: details.currentTier,
              }
            } catch (error) {
              console.error(`Error fetching details for pass ${pass.publicKey}:`, error)
              return null
            }
          }),
        )

        const validPasses = passesWithDetails.filter((pass): pass is MemberPass => pass !== null)
        const totalXp = validPasses.reduce((sum, pass) => sum + pass.xp, 0)

        return {
          address,
          passes: validPasses,
          totalXp,
        }
      }),
    )

    // Sort members by total XP
    const sortedMembers = members.sort((a, b) => b.totalXp - a.totalXp)

    return NextResponse.json(sortedMembers)
  } catch (error) {
    console.error('Error fetching program members:', error)
    return NextResponse.json({ error: 'Failed to fetch program members' }, { status: 500 })
  }
}
