'use client'
import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header/Header'
import { Hero3 } from '@/components/sections/Hero/Hero3'
import { Stories } from '@/components/sections/Stories/Stories'
import { Stories2 } from '@/components/sections/Stories/Stories2'
import { Petition } from '@/components/sections/Petition/Petition'
import { CTA } from '@/components/sections/CTA/CTA'
import { Ticker } from '@/components/common/Ticker/Ticker'
import { Footer } from '@/components/layout/Footer/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  useEffect(() => {
    const loadingTexts = [
      "41% of us need startup funding, but we're overlooked.",
      "We drive innovation but lack financial support.",
      "Our businesses could thrive with proper funding."
    ]

    let currentIndex = 0
    const progressPerText = 33.33

    const typeText = () => {
      if (currentIndex < loadingTexts[currentTextIndex].length) {
        setDisplayText(loadingTexts[currentTextIndex].slice(0, currentIndex + 1))
        currentIndex++
        setTimeout(typeText, 25)
      }
    }

    typeText()
    setProgress(progressPerText * (currentTextIndex + 1))

    const textInterval = setInterval(() => {
      if (currentTextIndex === loadingTexts.length - 1) {
        clearInterval(textInterval)
        setLoading(false)
        return
      }
      setCurrentTextIndex((prev) => prev + 1)
      currentIndex = 0
    }, 2000)

    return () => {
      clearInterval(textInterval)
    }
  }, [currentTextIndex])

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black gap-8">
        <div className="flex flex-col items-center gap-8">
          <Image 
            src="/logo/logo.png"
            alt="Logo"
            width={200}
            height={80}
            priority
          />
          <div className="h-[120px] flex items-center"> {/* Fixed height container */}
            <motion.p
              key={currentTextIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-white text-2xl md:text-4xl text-center max-w-3xl px-4"
            >
              {displayText}
            </motion.p>
          </div>
          <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 1.2,
          ease: "easeOut"
        }}
      >
        <Header />
        <main className="min-h-screen">
          <Hero3 />
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
