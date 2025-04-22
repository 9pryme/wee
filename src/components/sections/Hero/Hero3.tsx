'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { StoryCard } from '@/components/common/Card/StoryCard'
import Image from 'next/image'

export function Hero3() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [userInteracted, setUserInteracted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleUserInteraction = () => {
    setUserInteracted(true)
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  const texts = [
    {
      text: ["WE DRIVE 50% OF", "NIGERIA'S ECONOMY. BUT BANKS", "GIVE US LESS THAN 10% OF SME LOANS."],
      className: "text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-black font-['Oswald'] tracking-[-0.04em] text-center"
    },
    {
      text: ["62% OF US CAN'T GROW", "OUR BUSINESSES BECAUSE", "BANKS WON'T GIVE US LOANS."],
      className: "text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-black font-['Oswald'] tracking-[-0.04em] text-center"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTextIndex(prev => (prev + 1) % texts.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [texts.length])

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-[90vh] relative overflow-hidden flex items-center justify-center bg-'#2ECEB0'"
    >
      {/* Background with Beams */}
      <div className="absolute inset-0 z-0">
        <BackgroundBeams className="opacity-30" />
      </div>

      {/* Left Hand */}
      <div className="absolute left-0 bottom-0 z-10 hidden md:block">
        <Image
          src="/images/left.png"
          alt="Left Hand"
          width={300}
          height={400}
          className="object-contain"
        />
      </div>

      {/* Right Hand */}
      <div className="absolute right-0 bottom-0 z-10 hidden md:block">
        <Image
          src="/images/right.png"
          alt="Right Hand"
          width={300}
          height={400}
          className="object-contain"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 mt-20 md:mt-32">
        <div className="flex flex-col items-center w-full gap-12 md:gap-16">
          {/* Text Content */}
          <div className="w-full max-w-4xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentTextIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="space-y-2 md:space-y-4"
              >
                <div className={texts[currentTextIndex].className}>
                  {texts[currentTextIndex].text.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Video */}
          <div className="relative w-full max-w-[800px] aspect-video">
            <StoryCard 
              video="https://res.cloudinary.com/delpitwkb/video/upload/v1745336998/sample_5_tfglxf.mp4"
              thumbnail="https://res.cloudinary.com/delpitwkb/image/upload/v1745336920/thumbnail_eirfdn.jpg"
              className="mb-4 md:mb-8 rounded-[30px] md:rounded-[60px] w-full h-full object-cover"
              muted={false}
              loop={false}
              controls={false}
              autoPlay={false}
              onEnded={() => setUserInteracted(false)}
              ref={videoRef}
            />
            {!userInteracted && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold text-sm md:text-base"
                onClick={handleUserInteraction}
              >
                Click to Play Video
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}