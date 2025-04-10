'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Users, Gift, FileText, Key } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getProgramDetails } from '@verxioprotocol/core'
import { useVerxioProgram } from '@/lib/methods/initializeProgram'
import { publicKey } from '@metaplex-foundation/umi'

interface ProgramTier {
  name: string
  xpRequired: number
  rewards: string[]
}

interface ProgramDetails {
  name: string
  uri: string
  collectionAddress: string
  updateAuthority: string
  numMinted: number
  creator: string
  tiers: ProgramTier[]
  pointsPerAction: Record<string, number>
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<ProgramDetails[]>([])
  const context = useVerxioProgram()

  console.log(programs)
  console.log(context)

  useEffect(() => {
    async function fetchPrograms() {
      if (context) {
        context.collectionAddress = publicKey('CqQzB733uEozNpGwh2E7ENtUEba7DBdSKghEL5sxUTFD')
        try {
          const details = await getProgramDetails(context)
          // Add mock tiers and points data for now
          const programWithDetails = {
            ...details,
            tiers: [
              {
                name: 'Bronze',
                xpRequired: 500,
                rewards: ['2% cashback'],
              },
              {
                name: 'Silver',
                xpRequired: 1000,
                rewards: ['5% cashback'],
              },
            ],
            pointsPerAction: {
              purchase: 100,
              review: 50,
            },
          }
          setPrograms([programWithDetails])
        } catch (error) {
          console.error('Error fetching program details:', error)
        }
      }
    }

    fetchPrograms()
  }, [context])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white orbitron">Loyalty Programs</h1>
        <Link href="/dashboard/programs/new">
          <Button className="bg-gradient-to-r from-[#00FFE0] via-[#0085FF] to-[#7000FF] text-white hover:opacity-90 orbitron">
            <Plus className="mr-2 h-4 w-4" />
            Create Program
          </Button>
        </Link>
      </div>

      {programs.length === 0 ? (
        <Card className="bg-black/20 backdrop-blur-sm border-slate-800/20">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Gift className="h-12 w-12 text-[#00FFE0] mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Programs Yet</h3>
            <p className="text-white/70 mb-6">Create your first loyalty program to start rewarding your customers</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Link href={`/dashboard/programs/${program.collectionAddress}`} key={program.collectionAddress}>
              <Card className="bg-black/20 backdrop-blur-sm border-slate-800/20 hover:border-slate-700/40 transition-all cursor-pointer">
                <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                  <CardTitle className="text-xl text-white text-center">{program.name}</CardTitle>
                  <p className="text-sm text-white/50">
                    {program.creator.slice(0, 4)}...{program.creator.slice(-4)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-[#0085FF]" />
                        <span className="text-sm text-white/70">Total Members</span>
                      </div>
                      <span className="text-sm font-medium text-white">{program.numMinted}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-[#00FFE0]" />
                        <span className="text-sm text-white/70">URI</span>
                      </div>
                      <span className="text-sm font-medium text-white">{program.uri.slice(0, 10)}...</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Key className="h-4 w-4 text-[#7000FF]" />
                        <span className="text-sm text-white/70">Authority</span>
                      </div>
                      <span className="text-sm font-medium text-white">
                        {program.updateAuthority.slice(0, 4)}...{program.updateAuthority.slice(-4)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
