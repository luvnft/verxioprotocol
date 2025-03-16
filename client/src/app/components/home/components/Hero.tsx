export function Hero() {
  return (
    <section className="text-center pt-12 md:pt-20 pb-20 md:pb-32 px-4">
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 md:mb-6 font-space-grotesk">
        Reward Your Community
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 md:mb-12 px-4">
        On-chain loyalty and rewards system that combines gamified engagement and NFT based achievement tracking.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
        <a
          href="https://sandbox.verxio.xyz"
          className="w-full sm:w-auto bg-[#FFEB3B] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#FFE100] transition-colors"
        >
          Try in Sandbox
        </a>
        <a
          href="#"
          className="w-full sm:w-auto text-white border border-white/20 px-6 py-3 rounded-lg hover:bg-white/5 transition-colors"
        >
          Watch Demo →
        </a>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mt-12 md:mt-20 max-w-4xl mx-auto text-left px-4">
        <div className="bg-white/5 p-4 md:p-6 rounded-xl hover:bg-white/10 transition-colors">
          <h3 className="text-white font-medium mb-2 text-lg">Gamified Engagement</h3>
          <p className="text-gray-400 text-sm md:text-base">
            Earn XPs through meaningful interactions and community participation
          </p>
        </div>
        <div className="bg-white/5 p-4 md:p-6 rounded-xl hover:bg-white/10 transition-colors">
          <h3 className="text-white font-medium mb-2 text-lg">Achievement Tracking</h3>
          <p className="text-gray-400 text-sm md:text-base">Track progress and milestones with on-chain verification</p>
        </div>
        <div className="bg-white/5 p-4 md:p-6 rounded-xl hover:bg-white/10 transition-colors sm:col-span-2 md:col-span-1">
          <h3 className="text-white font-medium mb-2 text-lg">Exclusive Benefits</h3>
          <p className="text-gray-400 text-sm md:text-base">Redeem XP for discounts, upgrades, and special perks</p>
        </div>
      </div>
    </section>
  )
}
