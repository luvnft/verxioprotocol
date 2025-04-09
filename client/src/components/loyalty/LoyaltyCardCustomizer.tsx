'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { useWalletUi } from '@wallet-ui/react'
import { createNewLoyaltyProgram, Tier } from '@/lib/methods/createLoyaltyProgram'
import { HexColorPicker } from 'react-colorful'
import { useVerxioProgram } from '@/lib/methods/initializeProgram'
import { useRouter } from 'next/navigation'
import ProgramCard from './ProgramCard'

const colorOptions = [
  { name: 'Purple', value: 'purple' },
  { name: 'Blue', value: 'blue' },
  { name: 'Cyan', value: 'cyan' },
  { name: 'Pink', value: 'pink' },
  { name: 'Green', value: 'green' },
]

type ProgramColor = 'purple' | 'blue' | 'cyan' | 'pink' | 'green'

interface LoyaltyCardCustomizerProps {
  onRotationComplete?: () => void
}

export default function LoyaltyCardCustomizer({ onRotationComplete }: LoyaltyCardCustomizerProps) {
  const { account, connected } = useWalletUi()
  const context = useVerxioProgram()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    organizationName: '',
    metadataUri: '',
    metadata: {
      color: '#9d4edd', // Default purple
    },
    tiers: [{ name: '', xpRequired: 0, rewards: [''] }] as Tier[],
    pointsPerAction: {
      '': 0,
    } as Record<string, number>,
  })

  const [rotationCount, setRotationCount] = useState(0)
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0)
  const [qrCodeData, setQrCodeData] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleColorChange = (color: string) => {
    setFormData({
      ...formData,
      metadata: {
        ...formData.metadata,
        color: color,
      },
    })
  }

  const handleTierConfigChange = (index: number, field: keyof Tier, value: any) => {
    const newTierConfigs = [...formData.tiers]
    newTierConfigs[index] = {
      ...newTierConfigs[index],
      [field]: value,
    }
    setFormData({ ...formData, tiers: newTierConfigs })
  }

  const handlePointsPerActionChange = (action: string, value: number) => {
    setFormData({
      ...formData,
      pointsPerAction: {
        ...formData.pointsPerAction,
        [action]: value,
      },
    })
  }

  const handleAddTier = () => {
    setFormData({
      ...formData,
      tiers: [...formData.tiers, { name: '', xpRequired: 0, rewards: [''] }],
    })
  }

  const handleRemoveTier = (index: number) => {
    const newTierConfigs = formData.tiers.filter((_, i) => i !== index)
    setFormData({ ...formData, tiers: newTierConfigs })
  }

  const handleAddAction = () => {
    setFormData({
      ...formData,
      pointsPerAction: {
        ...formData.pointsPerAction,
        '': 0,
      },
    })
  }

  const handleRemoveAction = (action: string) => {
    const { [action]: removed, ...rest } = formData.pointsPerAction
    setFormData({ ...formData, pointsPerAction: rest })
  }

  const handleSave = async () => {
    if (!connected) {
      toast.error('Please connect your wallet to save the loyalty program')
      return
    }

    if (!context) {
      toast.error('Failed to initialize program context')
      return
    }

    setIsLoading(true)
    try {
      const result = await createNewLoyaltyProgram(context, {
        organizationName: formData.organizationName,
        metadataUri: formData.metadataUri,
        tiers: formData.tiers,
        pointsPerAction: formData.pointsPerAction,
      })

      console.log(result)
      // Clear form
      setFormData({
        organizationName: '',
        metadataUri: '',
        metadata: {
          color: '#9d4edd',
        },
        tiers: [{ name: '', xpRequired: 0, rewards: [''] }],
        pointsPerAction: {
          '': 0,
        },
      })

      // Generate QR code data with program details
      const qrData = {
        name: formData.organizationName,
        collectionAddress: result.collection.publicKey.toString(),
        creator: account?.address.toString(),
        uri: formData.metadataUri,
      }

      setQrCodeData(JSON.stringify(qrData))

      toast.success('Loyalty program created successfully!')

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating program:', error)
      toast.error('Failed to create loyalty program')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRotationComplete = () => {
    setRotationCount((prev) => prev + 1)
    setCurrentThemeIndex((prev) => (prev + 1) % colorOptions.length)
    setFormData((prev) => ({
      ...prev,
      programColor: colorOptions[(currentThemeIndex + 1) % colorOptions.length].value as ProgramColor,
    }))
    onRotationComplete?.()
  }

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 max-w-[1400px] mx-auto">
      <div className="lg:w-1/2 space-y-6">
        <Card className="bg-verxio-dark border-verxio-purple/20">
          <CardContent className="pt-6">
            <Tabs defaultValue="basics" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6 bg-verxio-dark/50">
                <TabsTrigger value="basics" className="pixel-font">
                  Basics
                </TabsTrigger>
                <TabsTrigger value="rewards" className="pixel-font">
                  Rewards
                </TabsTrigger>
                <TabsTrigger value="appearance" className="pixel-font">
                  Appearance
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basics" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organizationName" className="pixel-font">
                    Organization Name
                  </Label>
                  <Input
                    id="organizationName"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    className="bg-verxio-dark/50 border-verxio-purple/20 focus:border-verxio-purple orbitron placeholder:text-white/50 text-[10px] text-white/50 placeholder:orbitron placeholder:text-[10px]"
                    placeholder="Enter organization name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metadataUri" className="pixel-font">
                    Metadata URI
                  </Label>
                  <Input
                    id="metadataUri"
                    name="metadataUri"
                    value={formData.metadataUri}
                    onChange={handleInputChange}
                    className="bg-verxio-dark/50 border-verxio-purple/20 focus:border-verxio-purple orbitron placeholder:text-white/50 text-[10px] text-white/50 placeholder:orbitron placeholder:text-[10px]"
                    placeholder="Enter metadata URI"
                  />
                </div>
              </TabsContent>

              <TabsContent value="rewards" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="pixel-font">Tier Configuration</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddTier}
                      className="text-white/70 hover:text-white"
                    >
                      + Add Tier
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.tiers.map((tier, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded border-verxio-purple/20 bg-verxio-dark/50 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <Input
                            value={tier.name}
                            onChange={(e) => handleTierConfigChange(index, 'name', e.target.value)}
                            className="w-32 bg-verxio-dark/50 border-verxio-purple/20 focus:border-verxio-purple orbitron placeholder:orbitron placeholder:text-[10px] text-[10px] text-white/50"
                            placeholder="Tier name"
                          />
                          <Input
                            type="number"
                            value={tier.xpRequired}
                            onChange={(e) => handleTierConfigChange(index, 'xpRequired', parseInt(e.target.value) || 0)}
                            className="w-32 bg-verxio-dark/50 border-verxio-purple/20 focus:border-verxio-purple orbitron placeholder:orbitron placeholder:text-[10px] text-[10px] text-white/50"
                            placeholder="XP Required"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTier(index)}
                            className="text-white/70 hover:text-white"
                          >
                            ×
                          </Button>
                        </div>
                        <div className="flex flex-col gap-1">
                          {tier.rewards.map((reward, rewardIndex) => (
                            <div key={rewardIndex} className="flex items-center gap-2">
                              <Input
                                value={reward}
                                onChange={(e) => {
                                  const newRewards = [...tier.rewards]
                                  newRewards[rewardIndex] = e.target.value
                                  handleTierConfigChange(index, 'rewards', newRewards)
                                }}
                                className="bg-verxio-dark/50 border-verxio-purple/20 focus:border-verxio-purple orbitron placeholder:orbitron placeholder:text-[10px] text-[10px] text-white/50"
                                placeholder="Reward description"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newRewards = tier.rewards.filter((_, i) => i !== rewardIndex)
                                  handleTierConfigChange(index, 'rewards', newRewards)
                                }}
                                className="text-white/70 hover:text-white"
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newRewards = [...tier.rewards, '']
                              handleTierConfigChange(index, 'rewards', newRewards)
                            }}
                            className="text-white/70 hover:text-white"
                          >
                            + Add Reward
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="pixel-font">Points per Action</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddAction}
                      className="text-white/70 hover:text-white"
                    >
                      + Add Action
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(formData.pointsPerAction).map(([action, points], index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 border rounded border-verxio-purple/20 bg-verxio-dark/50"
                      >
                        <Input
                          value={action}
                          onChange={(e) => {
                            const newActions = {
                              ...formData.pointsPerAction,
                            }
                            delete newActions[action]
                            newActions[e.target.value] = points
                            setFormData({
                              ...formData,
                              pointsPerAction: newActions,
                            })
                          }}
                          className="w-32 bg-verxio-dark/50 border-verxio-purple/20 focus:border-verxio-purple orbitron placeholder:orbitron placeholder:text-[10px] text-[10px] text-white/50"
                          placeholder="Action name"
                        />
                        <Input
                          type="number"
                          value={points}
                          onChange={(e) => handlePointsPerActionChange(action, parseInt(e.target.value) || 0)}
                          className="w-24 bg-verxio-dark/50 border-verxio-purple/20 focus:border-verxio-purple orbitron placeholder:orbitron placeholder:text-[10px] text-[10px] text-white/50"
                          placeholder="Points"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAction(action)}
                          className="text-white/70 hover:text-white"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="pixel-font">Brand Color</Label>
                    <div className="flex items-center gap-4">
                      <HexColorPicker
                        color={formData.metadata.color}
                        onChange={handleColorChange}
                        className="w-[300px] h-[200px]"
                      />
                      <div
                        className="w-16 h-16 rounded-full border-2 border-white/20"
                        style={{ backgroundColor: formData.metadata.color }}
                      />
                    </div>
                  </div>

                  <div
                    className="mt-4 p-4 rounded-lg border border-white/20"
                    style={{
                      background: `linear-gradient(135deg, ${formData.metadata.color}40, ${formData.metadata.color}20)`,
                    }}
                  >
                    <p className="text-white/70 text-sm">Preview of your color scheme</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Button
          className={`w-full pixel-font bg-gradient-to-r from-[#00FFE0] via-[#0085FF] to-[#7000FF] text-white hover:opacity-90 py-6 px-8 rounded-lg text-sm ${!connected ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSave}
          disabled={!connected || isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating Program...
            </div>
          ) : connected ? (
            'Create Loyalty Program'
          ) : (
            'Connect Wallet to Create'
          )}
        </Button>
      </div>

      <div className="lg:w-1/2">
        <div className="sticky top-20">
          <div className="flex justify-center">
            <div className="w-full max-w-[500px] relative">
              {/* Glowing backdrop */}
              <div className="absolute -inset-4 bg-gradient-radial from-verxio-purple/30 to-transparent opacity-70 blur-xl rounded-full animate-pulse" />

              {/* Orbit effect */}
              <motion.div
                className="absolute -inset-12 border border-verxio-purple/20 rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                onAnimationComplete={handleRotationComplete}
              >
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-verxio-purple animate-pulse" />
              </motion.div>

              <motion.div
                className="relative"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <ProgramCard
                  programName={formData.organizationName || 'Organization Name'}
                  creator={account?.address.toString() || 'N/A'}
                  pointsPerAction={formData.pointsPerAction}
                  collectionAddress=""
                  qrCodeUrl={qrCodeData}
                  brandColor={formData.metadata.color}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
