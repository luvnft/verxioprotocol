'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { VerxioProtocol } from '../../../../../protocol/src/core/index';
import { useParams } from 'next/navigation';
import { Providers } from '../../providers';
import Link from 'next/link';
import { createSignerFromWalletAdapter } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { signerIdentity } from '@metaplex-foundation/umi';

function MintPageContent() {
  const { programId } = useParams();
  const { publicKey, wallet } = useWallet();
  const [verxio, setVerxio] = useState<VerxioProtocol | null>(null);
  const [loading, setLoading] = useState(false);
  const [programDetails, setProgramDetails] = useState<any>(null);
  const [network, setNetwork] = useState<'devnet' | 'mainnet' | 'sonic-mainnet' | 'sonic-testnet'>('devnet');

  useEffect(() => {
    if (programId && publicKey && wallet?.adapter) {
      const initializeProtocol = async () => {
        try {
          // Create protocol instance with connected wallet as authority
          const protocol = new VerxioProtocol(
            network,
            publicKey
          );

          // Set up wallet signer
          const walletSigner = createSignerFromWalletAdapter(wallet.adapter);
          protocol.umi.use(signerIdentity(walletSigner));

          // Initialize from existing program
          const initializedProtocol = await VerxioProtocol.fromExistingProgram(
            network,
            publicKey,
            programId as string,
            '', // Collection private key not needed for minting
          );

          setVerxio(initializedProtocol);

          // Fetch program details
          const tiers = await initializedProtocol.getProgramTiers();
          const pointsPerAction = await initializedProtocol.getPointsPerAction();
          
          setProgramDetails({
            tiers,
            pointsPerAction,
          });
        } catch (error) {
          console.error('Error initializing protocol:', error);
        }
      };

      initializeProtocol();
    }
  }, [programId, publicKey, wallet, network]);

  const mintPass = async () => {
    if (!verxio || !publicKey || !programDetails) return;
    setLoading(true);
    try {
      const result = await verxio.issueLoyaltyPass(
        publicKey,
        'Loyalty Pass',
        'https://arweave.net/default-pass-metadata' // You might want to get this from program details
      );
      // Redirect to the main dashboard or show success message
      window.location.href = `/program/${programId}`;
    } catch (error) {
      console.error('Error minting pass:', error);
    }
    setLoading(false);
  };

  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen p-8 relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs with glow */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-500/30 rounded-full mix-blend-overlay filter blur-[120px] animate-blob opacity-70"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/30 rounded-full mix-blend-overlay filter blur-[120px] animate-blob animation-delay-2000 opacity-70"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-pink-500/30 rounded-full mix-blend-overlay filter blur-[120px] animate-blob animation-delay-4000 opacity-70"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/50 via-gray-900/30 to-gray-900/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              <div className="flex items-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </div>
            </Link>
            <WalletMultiButton className="wallet-button" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );

  if (!publicKey) {
    return (
      <PageWrapper>
        <div className="glass-panel max-w-lg mx-auto text-center py-16">
          <div className="space-y-8">
            <div className="relative">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full opacity-20 animate-pulse animation-delay-2000"></div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold gradient-text mb-4">Connect Your Wallet</h2>
              <p className="text-gray-400 text-lg">Connect your wallet to mint your loyalty pass and start earning rewards</p>
            </div>
            
            <div className="relative">
              <WalletMultiButton className="wallet-button" />
              {/* Decorative line */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto">
        <div className="glass-panel space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              {programDetails?.name || 'Loyalty Program'}
            </h1>
            <p className="text-gray-400 text-lg">Join the loyalty program and start earning rewards</p>
          </div>

          {/* Program Details */}
          {programDetails && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">Available Actions</h3>
                  <ul className="space-y-2 text-gray-400">
                    {/* Add program actions here */}
                  </ul>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">Rewards</h3>
                  <ul className="space-y-2 text-gray-400">
                    {/* Add program rewards here */}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={mintPass}
            disabled={loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg
              hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg
              font-semibold text-lg relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative">
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Minting Pass...</span>
                </div>
              ) : (
                'Mint Loyalty Pass'
              )}
            </div>
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}

export default function MintPage() {
  return (
    <Providers>
      <MintPageContent />
    </Providers>
  );
}
