import { Hero } from "./components/Hero";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0B]">
      <div className="relative">
        {/* Top banner */}
        <div className="bg-[#E6E0FF] text-black py-1.5 px-4 text-center text-xs">
          <div className="flex items-center justify-center gap-3">
            <span>🎮 Gamified Rewards</span>
            <span className="text-gray-500">|</span>
            <span>🏆 Achievement System</span>
            <a href="#" className="font-medium hover:text-gray-700 transition-colors">
              Learn More →
            </a>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex justify-between items-center py-3 md:py-4 px-4 md:px-6">
          <div className="flex items-center">
            <Link href="/" className="text-white text-xl font-bold hover:text-gray-200 transition-colors">
              verxio
            </Link>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <Link href="#" className="text-white bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">
              Watch Demo
            </Link>
            <Link href="https://www.npmjs.com/package/@verxioprotocol/core" className="bg-[#FFEB3B] text-black px-4 py-2 rounded-lg hover:bg-[#FFE100] transition-colors">
              View Doc
            </Link>
          </div>
        </nav>

        {/* Feature Banner */}
        <div className="flex justify-center mt-4 px-4">
          <Link href="#" 
             className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-2 rounded-full text-sm md:text-base hover:bg-[#252525] transition-colors">
            <span className="bg-[#4CAF50] text-xs px-2 py-0.5 rounded">New</span>
            <span>Core NFT Experience Points →</span>
          </Link>
        </div>

        <Hero />
      </div>
    </main>
  );
} 