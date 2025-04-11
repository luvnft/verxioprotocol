'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black flex items-center justify-center">
      <Card className="bg-black/20 backdrop-blur-sm border-slate-800/20 max-w-md w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-semibold text-white orbitron mb-2">Page Not Found</h2>
          <p className="text-white/70 text-center mb-6">The page you're looking for doesn't exist or has been moved.</p>
          <Button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-[#00FFE0] via-[#0085FF] to-[#7000FF] text-white hover:opacity-90"
          >
            Return Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
