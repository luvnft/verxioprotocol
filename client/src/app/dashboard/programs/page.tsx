'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Users, Gift, FileText, Key, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { getProgramDetails } from '@verxioprotocol/core'
import { useVerxioProgram } from '@/lib/methods/initializeProgram'
import { publicKey } from '@metaplex-foundation/umi'
import { useWallet } from '@solana/wallet-adapter-react'

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
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const context = useVerxioProgram()
  const { publicKey: walletPublicKey } = useWallet()
  const isFetching = useRef(false)
  const mounted = useRef(true)

  const PROGRAMS_PER_PAGE = 9
  const totalPages = Math.ceil(programs.length / PROGRAMS_PER_PAGE)
  const startIndex = (currentPage - 1) * PROGRAMS_PER_PAGE
  const endIndex = startIndex + PROGRAMS_PER_PAGE
  const currentPrograms = programs.slice(startIndex, endIndex)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    async function fetchPrograms() {
      if (!context || !walletPublicKey || isFetching.current) return

      isFetching.current = true
      setIsLoading(true)

      try {
        // First fetch programs from database
        const response = await fetch(`/api/getPrograms?creator=${walletPublicKey.toString()}`)
        const dbPrograms = await response.json()
        console.log('dbPrograms', dbPrograms)

        // Then fetch program details for each program
        const programsWithDetails = await Promise.all(
          dbPrograms.map(async (program: any) => {
            try {
              context.collectionAddress = publicKey(program.publicKey)
              const details = await getProgramDetails(context)
              return details
            } catch (error) {
              console.error(`Error fetching details for program ${program.publicKey}:`, error)
              return null
            }
          }),
        )

        // Only update state if component is still mounted
        if (mounted.current) {
          setPrograms(programsWithDetails.filter(Boolean))
        }
      } catch (error) {
        console.error('Error fetching programs:', error)
      } finally {
        if (mounted.current) {
          setIsLoading(false)
        }
        isFetching.current = false
      }
    }

    fetchPrograms()
  }, [context?.collectionAddress, walletPublicKey?.toString()])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-verxio-purple mx-auto" />
          <p className="text-white/70 orbitron">Loading your programs...</p>
        </div>
      </div>
    )
  }

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
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentPrograms.map((program) => (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                className="bg-black/20 border border-verxio-purple/20 text-white px-4 py-2 rounded-lg hover:bg-black/30 transition-colors"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-white/70 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="bg-black/20 border border-verxio-purple/20 text-white px-4 py-2 rounded-lg hover:bg-black/30 transition-colors"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
