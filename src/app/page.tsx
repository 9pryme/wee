'use client'
import { Hero3 } from '@/components/sections/Hero/Hero3'
import { Stories } from '@/components/sections/Stories/Stories'
import { Stories2 } from '@/components/sections/Stories/Stories2'
import { Petition } from '@/components/sections/Petition/Petition'
import { CTA } from '@/components/sections/CTA/CTA'
import { Ticker } from '@/components/common/Ticker/Ticker'
import { Footer } from '@/components/layout/Footer/Footer'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 1.2,
          ease: "easeOut"
        }}
        className="bg-[#2ECEB0]"
      >
        <main className="min-h-screen">
          <div id="hero3-section">
            <Hero3 />
          </div>
          <div className="relative z-50">
            <Ticker 
              items={["WHERE'S OUR MONEY?"]} 
              className="text-2xl font-['Oswald'] font-bold text-center text-white justify-center"
            />
          </div>
          <Stories />
          <Stories2 />
          <Petition />
          <CTA />
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  )
}
