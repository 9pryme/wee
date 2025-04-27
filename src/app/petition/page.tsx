'use client'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { BackgroundBeams } from '@/components/ui/background-beams'
import Image from 'next/image'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackClick } from '@/lib/utm'
import { Suspense } from 'react'

// Dynamically import PetitionForm with no SSR
const PetitionForm = dynamic(
  () => import('@/components/sections/Petition/PetitionForm').then(mod => mod.PetitionForm),
  { ssr: false }
)

function PetitionContent() {
  const searchParams = useSearchParams()
  const trackingId = searchParams?.get('ref')

  useEffect(() => {
    const trackPageLoad = async () => {
      if (!trackingId) return

      try {
        await trackClick(trackingId)
      } catch (error) {
        console.error('Error tracking click:', error)
      }
    }

    trackPageLoad()
  }, [trackingId])

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
                <span className="block">Tell Your Bank</span>
                <span className="block">to Fund Women Now</span>
              </h1>
            </motion.div>

            {/* Demands List - Mobile */}
            <div className="lg:hidden space-y-4 mb-8">
              {demands.map((demand, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                >
                  <p className="text-white text-sm sm:text-base">
                    {demand}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Demands List - Desktop */}
            <div className="hidden lg:block space-y-4">
              {demands.map((demand, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                >
                  <p className="text-white text-sm sm:text-base">
                    {demand}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Form */}
          <div className="w-full lg:w-[500px] flex-shrink-0">
            <PetitionForm trackingId={trackingId} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default function PetitionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PetitionContent />
    </Suspense>
  )
}