'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Clock } from 'lucide-react'

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white orbitron">Leaderboard</h1>
      </div>

      <Card className="bg-black/20 backdrop-blur-sm border-slate-800/20">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-white/70" />
          </div>
          <h2 className="text-xl font-semibold text-white orbitron mb-2">Coming Soon</h2>
          <p className="text-white/70 text-center max-w-md">
            We're working on something exciting! Soon you'll be able to track loyalty points, manage rewards, and
            analyze engagement.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
