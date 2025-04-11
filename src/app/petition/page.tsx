'use client'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { BackgroundBeams } from '@/components/ui/background-beams'
import Image from 'next/image'

// Dynamically import PetitionForm with no SSR
const PetitionForm = dynamic(
  () => import('@/components/sections/Petition/PetitionForm').then(mod => mod.PetitionForm),
  { ssr: false }
)

export default function PetitionPage() {
  const demands = [
    "Create or expand dedicated women's business credit fund with friendly-interest rates",
    "Reserve 40% of your MSME loan portfolio to women and simplify collateral requirements", 
    "Mandate 30% gender-based lending targets for commercial banks",
    "Reserve 50% of government MSME intervention funds exclusively for women"
  ]

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <BackgroundBeams className="opacity-30" />
      </div>

      <div className="relative z-10 container mx-auto px-2 sm:px-4 py-16 md:py-32">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white mb-8 md:mb-16"
            >
              <div className="flex justify-center lg:justify-start">
                <Image
                  src="/logo/logo.png"
                  alt="Logo"
                  width={400}
                  height={120}
                  className="w-auto h-12 md:h-20 mb-6 md:mb-12"
                />
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-['Oswald'] font-bold uppercase">
                Tell Your Bank to Fund Women Now
              </h1>
            </motion.div>

            {/* Demands List - Mobile */}
            <motion.div 
              className="lg:hidden bg-white/5 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 border border-white/10 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2
              }}
            >
              <ul className="list-disc list-inside text-white space-y-4 text-left">
                {demands.map((demand, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.4 + (index * 0.1)
                    }}
                    className="text-sm md:text-base"
                  >
                    {demand}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Demands List - Desktop */}
            <motion.div 
              className="hidden lg:block bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2
              }}
            >
              <ul className="list-disc list-inside text-white space-y-6 text-left">
                {demands.map((demand, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.4 + (index * 0.1)
                    }}
                    className="text-lg"
                  >
                    {demand}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Right Form */}
          <div className="w-full lg:w-[500px] flex-shrink-0">
            <PetitionForm />
          </div>
        </div>
      </div>
    </main>
  )
}