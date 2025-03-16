'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useState, useEffect, useMemo } from 'react'
import { VerxioContext, initializeVerxio, createLoyaltyProgram, issueLoyaltyPass } from '@verxioprotocol/core'
import { KeypairSigner, publicKey as createUmiPublicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ActionPanel } from './ActionPanel'

interface Tier {
  name: string
  xpRequired: number
  rewards: string[]
}

interface PointsPerAction {
  [key: string]: number
}

export type NetworkOption = 'devnet' | 'mainnet' | 'sonic-mainnet' | 'sonic-testnet'
export const RPC_URLS: Record<NetworkOption, string> = {
  devnet: 'https://api.devnet.solana.com',
  mainnet: 'https://api.mainnet-beta.solana.com',
  'sonic-mainnet': 'https://mainnet.rpc.sonic.so',
  'sonic-testnet': 'https://testnet.rpc.sonic.so',
}

export function LoyaltyProgram() {
  const { publicKey, wallet, connected } = useWallet()
  const [verxio, setVerxio] = useState<VerxioContext | null>(null)
  type StepType = 'program' | 'pass' | 'details'
  const [step, setStep] = useState<StepType>('program')
  const [network, setNetwork] = useState<NetworkOption>('devnet')
  const [targetAddress, setTargetAddress] = useState<string>('')
  const [programId, setProgramId] = useState<string | null>(null)
  const [userPass, setUserPass] = useState<string | null>(null)
  const [passSigner, setPassSigner] = useState<KeypairSigner | null>(null)
  const [loading, setLoading] = useState(false)
  const [programSignature, setProgramSignature] = useState<string | null>(null)
  const [passSignature, setPassSignature] = useState<string | null>(null)

  // Program configuration state
  const [programName, setProgramName] = useState('')
  const [metadataUri, setMetadataUri] = useState('')
  const [tiers, setTiers] = useState<Tier[]>([{ name: 'Grind', xpRequired: 0, rewards: ['nothing for you!'] }])
  const [actions, setActions] = useState<PointsPerAction>({})
  const [newAction, setNewAction] = useState({ name: '', points: 0 })
  const [newTier, setNewTier] = useState({
    name: '',
    xpRequired: 0,
    rewards: [''],
  })

  // Create UMI instance based on selected network
  const umi = useMemo(() => {
    return createUmi(RPC_URLS[network])
  }, [network])

  // Update useEffect to use memoized umi
  useEffect(() => {
    if (publicKey && wallet?.adapter && connected) {
      const umiPubKey = createUmiPublicKey(publicKey.toBase58())
      const context = initializeVerxio(umi, umiPubKey)

      if (programId) {
        context.collectionAddress = createUmiPublicKey(programId)
      }

      setVerxio(context)
    } else {
      setVerxio(null)
    }
  }, [publicKey, wallet, connected, network, programId, umi])

  const addTier = () => {
    if (newTier.name && newTier.xpRequired >= 0) {
      setTiers([...tiers, { ...newTier, rewards: [newTier.rewards[0]] }])
      setNewTier({ name: '', xpRequired: 0, rewards: [''] })
    }
  }

  const addAction = () => {
    if (newAction.name && newAction.points > 0) {
      setActions({ ...actions, [newAction.name]: newAction.points })
      setNewAction({ name: '', points: 0 })
    }
  }

  const removeTier = (indexToRemove: number) => {
    if (indexToRemove === 0) return
    setTiers(tiers.filter((_, index) => index !== indexToRemove))
  }

  const removeAction = (nameToRemove: string) => {
    const newActions = { ...actions }
    delete newActions[nameToRemove]
    setActions(newActions)
  }

  const getExplorerUrl = (signature: string) => {
    return RPC_URLS[network].replace('{address}', signature)
  }

  const createProgram = async () => {
    if (!verxio || !programName) return
    setLoading(true)
    try {
      toast.info('Creating new loyalty program via createProgram() method')
      const result = await createLoyaltyProgram(verxio, {
        organizationName: programName,
        metadataUri: metadataUri,
        tiers,
        pointsPerAction: actions,
        programAuthority: verxio.programAuthority,
      })

      const collectionAddress = result.signer.publicKey.toString()
      setProgramId(collectionAddress)
      setProgramSignature(result.signature)
      if (verxio) {
        verxio.collectionAddress = createUmiPublicKey(collectionAddress)
      }
      toast.success('Successfully created new loyalty program')
      setStep('pass')
    } catch (error) {
      console.error('Error creating program:', error)
      toast.error('Failed to create loyalty program')
    }
    setLoading(false)
  }

  const createLoyaltyPass = async () => {
    if (!verxio || !publicKey || !programName) return
    if (!wallet?.adapter.connected) {
      await wallet?.adapter.connect()
    }
    setLoading(true)
    try {
      toast.info('Creating loyalty pass via issueLoyaltyPass() method')
      const config = {
        collectionAddress: verxio.collectionAddress!,
        recipient: createUmiPublicKey(publicKey.toBase58()),
        passName: `${programName} Loyalty Pass`,
        passMetadataUri: metadataUri,
      }
      const result = await issueLoyaltyPass(verxio, config)

      setUserPass(result.signer.publicKey)
      setPassSigner(result.signer)
      setPassSignature(result.signature)

      toast.success('Successfully created loyalty pass')
      setStep('details')
    } catch (error) {
      toast.error('Failed to create loyalty pass')
    }
    setLoading(false)
  }

  const copyToClipboard = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Successfully copied to clipboard')
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  // Wallet Connect View
  if (!publicKey) {
    return (
      <div className="glass-panel shadow-2xl shadow-zinc-900/20 rounded-xl">
        <div className="relative overflow-hidden">
          {/* Blurred overlay */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-4 text-center">Verxio Protocol Sandbox</h2>
            <p className="text-zinc-600 text-center max-w-md mb-6">
              Connect your wallet to create and manage your own onchain loyalty programs.
            </p>
          </div>

          {/* Preview Form */}
          <div className="opacity-50 pointer-events-none p-8">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold gradient-text mb-2">Create Loyalty Program</h2>
                <p className="text-gray-400 text-sm">Design your program structure and define rewards</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-zinc-900">Program Name</label>
                  <input
                    type="text"
                    value="Coffee Rewards"
                    disabled
                    className="w-full px-4 py-2 rounded-lg border border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-zinc-900">Network</label>
                  <select
                    disabled
                    className="w-full px-4 py-2 rounded-lg border border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option>Solana Devnet</option>
                  </select>
                </div>
              </div>

              {/* Sample Tiers */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-900">Loyalty Tiers</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg border border-zinc-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <span className="text-zinc-900">
                          <span className="text-blue-600 font-medium">100 XP</span> unlocks Bronze rewards
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-900">Point Actions</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg border border-zinc-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <span className="text-zinc-900">Complete Purchase to gain</span>
                        <span className="text-blue-600 font-medium ml-1">50 points</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Initialize Protocol if not already initialized
  if (!verxio && step === 'program') {
    // initializeProtocol();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="glass-panel shadow-2xl shadow-zinc-900/20 rounded-xl p-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {/* Step 1 */}
            <div className="flex-1 relative">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-2 ${step === 'program' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <span className="text-lg font-semibold">1</span>
              </div>
              <div className="text-center">
                <span className={`text-sm font-medium ${step === 'program' ? 'text-blue-600' : 'text-gray-500'}`}>
                  Create Program
                </span>
              </div>
              {/* Line to Step 2 */}
              <div
                className={`absolute top-6 left-[65%] w-[70%] h-1 ${step === 'program' ? 'bg-gray-200' : 'bg-blue-600'}`}
              ></div>
            </div>

            {/* Step 2 */}
            <div className="flex-1 relative">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-2 ${step === 'pass' ? 'bg-blue-600 text-white' : programId ? 'bg-gray-200 text-gray-600' : 'bg-gray-200 text-gray-400'}`}
              >
                <span className="text-lg font-semibold">2</span>
              </div>
              <div className="text-center">
                <span
                  className={`text-sm font-medium ${step === 'pass' ? 'text-blue-600' : programId ? 'text-gray-500' : 'text-gray-400'}`}
                >
                  Loyalty Pass
                </span>
              </div>
              {/* Line to Step 3 */}
              <div
                className={`absolute top-6 left-[65%] w-[70%] h-1 ${step === 'details' ? 'bg-blue-600' : 'bg-gray-200'}`}
              ></div>
            </div>

            {/* Step 3 */}
            <div className="flex-1">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-2 ${step === 'details' ? 'bg-blue-600 text-white' : userPass ? 'bg-gray-200 text-gray-600' : 'bg-gray-200 text-gray-400'}`}
              >
                <span className="text-lg font-semibold">3</span>
              </div>
              <div className="text-center">
                <span
                  className={`text-sm font-medium ${step === 'details' ? 'text-blue-600' : userPass ? 'text-gray-500' : 'text-gray-400'}`}
                >
                  Pass Details
                </span>
              </div>
            </div>
          </div>
        </div>

        {step === 'program' && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold gradient-text mb-2">Create Loyalty Program</h2>
              <p className="text-gray-400 text-sm">Design your program structure and define rewards</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-zinc-900">Program Name</label>
                  <input
                    type="text"
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Enter your program name (e.g. Coffee Rewards)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-zinc-900">Network</label>
                  <select
                    value={network}
                    onChange={(e) => {
                      setNetwork(e.target.value as NetworkOption)
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="devnet">Solana Devnet</option>
                    <option value="mainnet">Solana Mainnet</option>
                    <option value="sonic-mainnet">Sonic Mainnet</option>
                    <option value="sonic-testnet">Sonic Testnet</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-zinc-900">Metadata URI</label>
                <input
                  type="text"
                  value={metadataUri}
                  onChange={(e) => setMetadataUri(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="https://arweave.net/..."
                />
              </div>

              {/* Tiers Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-900">Loyalty Tiers</h3>

                <div className="space-y-3">
                  {tiers.map((tier, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-blue-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <span className="text-zinc-900">
                              <span className="text-blue-600 font-medium">{tier.xpRequired} XP</span> unlocks
                            </span>
                            <span className="text-zinc-900 ml-1">{tier.rewards.join(', ').toLowerCase()}</span>
                          </div>
                        </div>
                        {index !== 0 && (
                          <button
                            onClick={() => removeTier(index)}
                            className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                            title="Remove tier"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border border-dashed border-zinc-700 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Bronze, Silver, Gold..."
                      value={newTier.name}
                      onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
                      className="px-4 py-2 rounded-lg border border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="number"
                      placeholder="XP Required (e.g. 100)"
                      value={newTier.xpRequired}
                      onChange={(e) => setNewTier({ ...newTier, xpRequired: parseInt(e.target.value) || 0 })}
                      className="px-4 py-2 rounded-lg border border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="text"
                      placeholder="10% cashback, Free item..."
                      value={newTier.rewards[0]}
                      onChange={(e) => setNewTier({ ...newTier, rewards: [e.target.value] })}
                      className="px-4 py-2 rounded-lg border border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <button
                    onClick={addTier}
                    className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors flex items-center text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Tier
                  </button>
                </div>
              </div>

              {/* Actions Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-900">Point Actions</h3>

                <div className="space-y-3">
                  {Object.entries(actions).map(([name, points]) => (
                    <div
                      key={name}
                      className="p-4 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-blue-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <span className="text-zinc-900">Complete {name.toLowerCase()} action to gain</span>
                            <span className="text-blue-600 font-medium ml-1">{points} points</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeAction(name)}
                          className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                          title="Remove action"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border border-dashed border-zinc-700 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Purchase, Review, Share..."
                      value={newAction.name}
                      onChange={(e) => setNewAction({ ...newAction, name: e.target.value })}
                      className="px-4 py-2 rounded-lg border border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Points (e.g. 50)"
                      value={newAction.points}
                      onChange={(e) => setNewAction({ ...newAction, points: parseInt(e.target.value) || 0 })}
                      className="px-4 py-2 rounded-lg border border-zinc-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <button
                    onClick={addAction}
                    className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors flex items-center text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Action
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800">
              <button
                onClick={createProgram}
                disabled={loading || !programName || !verxio}
                className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Creating Program...</span>
                  </div>
                ) : (
                  'Create Program'
                )}
              </button>
            </div>
          </div>
        )}

        {step === 'pass' && (
          <div className="animate-fade-in space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold gradient-text mb-2">Program Created Successfully!</h2>
              <p className="text-gray-600 text-sm">Your loyalty program is now live on the blockchain</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-6">
                <div className="bg-white/50 rounded-xl p-6 space-y-4 backdrop-blur-sm border border-zinc-200">
                  <h3 className="text-lg font-semibold text-zinc-900">Program Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-900 mb-2">Program ID</label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-300 bg-white">
                          <p className="font-mono text-zinc-900 break-all text-sm">{programId}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(programId || '', 'Program ID copied to clipboard!')}
                          className="p-2.5 text-zinc-600 hover:text-blue-600 transition-colors bg-white rounded-lg border border-zinc-300"
                          title="Copy Program ID"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-900 mb-2">Shareable Link</label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-300 bg-white">
                          <p className="font-mono text-zinc-900 break-all text-sm">{`${window.location.origin}/mint/${programId}`}</p>
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              `${window.location.origin}/mint/${programId}`,
                              'Shareable link copied to clipboard!',
                            )
                          }
                          className="p-2.5 text-zinc-600 hover:text-blue-600 transition-colors bg-white rounded-lg border border-zinc-300"
                          title="Copy Link"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                        </button>
                        <a
                          href={`${window.location.origin}/mint/${programId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 text-zinc-600 hover:text-blue-600 transition-colors bg-white rounded-lg border border-zinc-300"
                          title="Visit Link"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </a>
                      </div>
                    </div>

                    {programSignature && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-900 mb-2">Transaction Details</label>
                        <a
                          href={getExplorerUrl(programSignature)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <span className="text-sm font-medium">View on Explorer</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'details' && userPass && verxio && passSigner && (
          <ActionPanel
            verxio={verxio}
            passAddress={createUmiPublicKey(userPass)}
            passSigner={passSigner}
            network={network}
            targetAddress={createUmiPublicKey(targetAddress)}
          />
        )}
      </div>
    </div>
  )
}
