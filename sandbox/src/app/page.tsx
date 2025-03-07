"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Providers } from "./providers";
import { LoyaltyProgram } from "./components/LoyaltyProgram";

export default function Home() {
  return (
    <Providers>
      <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-end items-center mb-12">
              <WalletMultiButton />
            </div>
            {/* Main Content */}
            <LoyaltyProgram />
          </div>
        </div>
      </main>
    </Providers>
  );
}
