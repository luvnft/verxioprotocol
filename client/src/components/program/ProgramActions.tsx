'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Info, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { SuccessModal } from '@/components/ui/success-modal'
import { useNetwork } from '@/lib/network-context'
import {
  issuePasses,
  awardPointsToPasses,
  giftPointsToPasses,
  revokePointsFromPasses,
} from '@/app/actions/manage-program'

interface ProgramActionsProps {
  programId: string
  pointsPerAction: Record<string, number>
  programName: string
  programUri: string
}

export function ProgramActions({ programId, pointsPerAction, programName, programUri }: ProgramActionsProps) {
  const [activeTab, setActiveTab] = useState('issue')
  const [address, setAddress] = useState('')
  const [selectedAction, setSelectedAction] = useState('')
  const [pointsToRevoke, setPointsToRevoke] = useState('')
  const [pointsToGift, setPointsToGift] = useState('')
  const [action, setAction] = useState('')
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successData, setSuccessData] = useState<{ title: string; message: string; signature?: string } | null>(null)
  const { network } = useNetwork()

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setAddress('')
    setSelectedAction('')
    setPointsToRevoke('')
    setPointsToGift('')
    setAction('')
    setCsvFile(null)
  }

  const handleIssuePass = async () => {
    setIsLoading(true)
    try {
      const inputs = csvFile ? await parseCsvFile(csvFile) : [address]

      const results = await issuePasses(
        inputs.map((recipient) => ({
          collectionAddress: programId,
          recipient,
          passName: programName,
          passMetadataUri: programUri,
          network,
        })),
      )

      setSuccessData({
        title: 'Pass Issued Successfully',
        message:
          inputs.length === 1
            ? 'Your loyalty pass has been issued successfully'
            : `Successfully issued ${inputs.length} loyalty passes`,
        signature: inputs.length === 1 ? results[0].signature : undefined,
      })
      setShowSuccessModal(true)
      setAddress('')
      setCsvFile(null)
    } catch (error) {
      console.error('Error issuing pass:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to issue pass')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAwardPoints = async () => {
    setIsLoading(true)
    try {
      const inputs = csvFile ? await parseCsvFileWithActions(csvFile) : [{ address, action: selectedAction }]
      const results = await awardPointsToPasses(
        inputs.map((input) => ({
          passAddress: input.address,
          action: input.action,
          network,
        })),
      )

      setSuccessData({
        title: 'Points Awarded Successfully',
        message:
          inputs.length === 1
            ? `Successfully awarded points for ${selectedAction}`
            : `Successfully awarded points to ${inputs.length} loyalty passes`,
        signature: inputs.length === 1 ? results[0].signature : undefined,
      })
      setShowSuccessModal(true)
      setAddress('')
      setSelectedAction('')
      setCsvFile(null)
    } catch (error) {
      console.error('Error awarding points:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to award points')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGiftPoints = async () => {
    setIsLoading(true)
    try {
      const inputs = csvFile
        ? await parseCsvFileWithGiftPoints(csvFile)
        : [{ address, points: parseInt(pointsToGift), action }]

      const results = await giftPointsToPasses(
        inputs.map((input) => ({
          passAddress: input.address,
          pointsToGift: input.points,
          action: input.action,
          network,
        })),
      )

      setSuccessData({
        title: 'Points Gifted Successfully',
        message:
          inputs.length === 1
            ? `Successfully gifted ${pointsToGift} points for ${action}`
            : `Successfully gifted points to ${inputs.length} loyalty passes`,
        signature: inputs.length === 1 ? results[0].signature : undefined,
      })
      setShowSuccessModal(true)
      setAddress('')
      setPointsToGift('')
      setAction('')
      setCsvFile(null)
    } catch (error) {
      console.error('Error gifting points:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to gift points')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRevokePoints = async () => {
    setIsLoading(true)
    try {
      const inputs = csvFile ? await parseCsvFileWithPoints(csvFile) : [{ address, points: parseInt(pointsToRevoke) }]

      const results = await revokePointsFromPasses(
        inputs.map((input) => ({
          passAddress: input.address,
          pointsToRevoke: input.points,
          network,
        })),
      )

      setSuccessData({
        title: 'Points Revoked Successfully',
        message:
          inputs.length === 1
            ? `Successfully revoked ${pointsToRevoke} points`
            : `Successfully revoked points from ${inputs.length} loyalty passes`,
        signature: inputs.length === 1 ? results[0].signature : undefined,
      })
      setShowSuccessModal(true)
      setAddress('')
      setPointsToRevoke('')
      setCsvFile(null)
    } catch (error) {
      console.error('Error revoking points:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to revoke points')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card className="bg-black/20 backdrop-blur-sm border-slate-800/20">
        <CardHeader>
          <CardTitle className="text-lg">Program Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="issue">Issue Pass</TabsTrigger>
              <TabsTrigger value="award">Award Points</TabsTrigger>
              <TabsTrigger value="gift">Gift Points</TabsTrigger>
              <TabsTrigger value="revoke">Revoke Points</TabsTrigger>
            </TabsList>

            <TabsContent value="issue" className="space-y-4">
              <div className="space-y-2">
                <Label className="orbitron">Wallet Address</Label>
                <Input
                  placeholder="Enter wallet address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="orbitron text-xs text-white/50">Premium: Upload CSV</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                        <Info className="h-4 w-4 text-white/50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-slate-900 border-slate-700/20">
                      <div className="space-y-2">
                        <h4 className="font-medium orbitron">Premium Feature (Coming Soon)</h4>
                        <p className="text-sm text-white/90">Batch operations are available in our premium plan.</p>
                        <p className="text-sm text-white/90 mt-2">Upgrade to process multiple addresses at once.</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="file" accept=".csv" className="cursor-not-allowed opacity-50" disabled />
                  <Button variant="outline" size="icon" disabled>
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleIssuePass}
                disabled={!address || isLoading}
                className="w-full bg-gradient-to-r from-[#00FFE0] via-[#0085FF] to-[#7000FF] text-white hover:opacity-90 orbitron disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Issuing Pass...
                  </>
                ) : (
                  'Issue Loyalty Pass'
                )}
              </Button>
            </TabsContent>

            <TabsContent value="award" className="space-y-4">
              <div className="space-y-2">
                <Label className="orbitron">Loyalty Pass Address</Label>
                <Input
                  placeholder="Enter the loyalty pass address to reward"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="orbitron">Action</Label>
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an action" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(pointsPerAction).filter(([action]) => action && action.trim() !== '').length > 0 ? (
                      Object.entries(pointsPerAction)
                        .filter(([action]) => action && action.trim() !== '')
                        .map(([action, points]) => (
                          <SelectItem key={action} value={action}>
                            {action} ({points} points)
                          </SelectItem>
                        ))
                    ) : (
                      <SelectItem value="no-action" disabled>
                        No actions found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="orbitron text-xs text-white/50">Premium: Upload CSV</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                        <Info className="h-4 w-4 text-white/50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-slate-900 border-slate-700/20">
                      <div className="space-y-2">
                        <h4 className="font-medium orbitron">Premium Feature (Coming Soon)</h4>
                        <p className="text-sm text-white/90">Batch operations are available in our premium plan.</p>
                        <p className="text-sm text-white/90 mt-2">Upgrade to process multiple addresses at once.</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="file" accept=".csv" className="cursor-not-allowed opacity-50" disabled />
                  <Button variant="outline" size="icon" disabled>
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleAwardPoints}
                disabled={!address || !selectedAction || isLoading}
                className="w-full bg-gradient-to-r from-[#00FFE0] via-[#0085FF] to-[#7000FF] text-white hover:opacity-90 orbitron disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Awarding Points...
                  </>
                ) : (
                  'Award Loyalty Points'
                )}
              </Button>
            </TabsContent>

            <TabsContent value="gift" className="space-y-4">
              <div className="space-y-2">
                <Label className="orbitron">Loyalty Pass Address</Label>
                <Input
                  placeholder="Enter the loyalty pass address to gift points"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="orbitron">Points to Gift</Label>
                <Input
                  type="number"
                  placeholder="Enter number of points to gift"
                  value={pointsToGift}
                  onChange={(e) => setPointsToGift(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="orbitron">Reason</Label>
                <Input
                  placeholder="Enter reason for gifting points"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="orbitron text-xs text-white/50">Premium: Upload CSV</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                        <Info className="h-4 w-4 text-white/50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-slate-900 border-slate-700/20">
                      <div className="space-y-2">
                        <h4 className="font-medium orbitron">Premium Feature (Coming Soon)</h4>
                        <p className="text-sm text-white/90">Batch operations are available in our premium plan.</p>
                        <p className="text-sm text-white/90 mt-2">Upgrade to process multiple addresses at once.</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="file" accept=".csv" className="cursor-not-allowed opacity-50" disabled />
                  <Button variant="outline" size="icon" disabled>
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleGiftPoints}
                disabled={!address || !pointsToGift || !action || isLoading}
                className="w-full bg-gradient-to-r from-[#00FFE0] via-[#0085FF] to-[#7000FF] text-white hover:opacity-90 orbitron disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gifting Points...
                  </>
                ) : (
                  'Gift Loyalty Points'
                )}
              </Button>
            </TabsContent>

            <TabsContent value="revoke" className="space-y-4">
              <div className="space-y-2">
                <Label className="orbitron">Loyalty Pass Address</Label>
                <Input
                  placeholder="Enter the loyalty address to debit from"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="orbitron">Points to Revoke</Label>
                <Input
                  type="number"
                  placeholder="Enter number of points to revoke"
                  value={pointsToRevoke}
                  onChange={(e) => setPointsToRevoke(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="orbitron text-xs text-white/50">Premium: Upload CSV</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                        <Info className="h-4 w-4 text-white/50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-slate-900 border-slate-700/20">
                      <div className="space-y-2">
                        <h4 className="font-medium orbitron">Premium Feature (Coming Soon)</h4>
                        <p className="text-sm text-white/90">Batch operations are available in our premium plan.</p>
                        <p className="text-sm text-white/90 mt-2">Upgrade to process multiple addresses at once.</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="file" accept=".csv" className="cursor-not-allowed opacity-50" disabled />
                  <Button variant="outline" size="icon" disabled>
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleRevokePoints}
                disabled={!address || !pointsToRevoke || isLoading}
                className="w-full bg-gradient-to-r from-[#00FFE0] via-[#0085FF] to-[#7000FF] text-white hover:opacity-90 orbitron disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Revoking Points...
                  </>
                ) : (
                  'Revoke Loyalty Points'
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {successData && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title={successData.title}
          message={successData.message}
          transactionSignature={successData.signature}
          network={network}
        />
      )}
    </>
  )
}

async function parseCsvFile(file: File): Promise<string[]> {
  const text = await file.text()
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

async function parseCsvFileWithActions(file: File): Promise<{ address: string; action: string }[]> {
  const text = await file.text()
  return text
    .split('\n')
    .map((line) => {
      const [address, action] = line.split(',').map((item) => item.trim())
      return { address, action }
    })
    .filter((record) => record.address && record.action)
}

async function parseCsvFileWithPoints(file: File): Promise<{ address: string; points: number; action: string }[]> {
  const text = await file.text()
  return text
    .split('\n')
    .map((line) => {
      const [address, points, action] = line.split(',').map((item) => item.trim())
      return { address, points: parseInt(points), action: action || 'gift' }
    })
    .filter((record) => record.address && !isNaN(record.points))
}

async function parseCsvFileWithGiftPoints(file: File): Promise<{ address: string; points: number; action: string }[]> {
  const text = await file.text()
  return text
    .split('\n')
    .map((line) => {
      const [address, points, action] = line.split(',').map((item) => item.trim())
      return { address, points: parseInt(points), action: action || 'gift' }
    })
    .filter((record) => record.address && !isNaN(record.points))
}
