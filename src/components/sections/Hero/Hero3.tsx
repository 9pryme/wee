'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { BackgroundBeams } from '@/components/ui/background-beams'

export function Hero3() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const texts = [
    {
      text: ["WE DRIVE 50% OF", "NIGERIA'S ECONOMY. BUT BANKS", "GIVE US LESS THAN 10% OF SME LOANS."],
      className: "text-3xl md:text-6xl font-bold text-[#F8EFE2] font-['Oswald'] tracking-[-0.04em] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] text-center"
    },
    {
      text: ["62% OF US CAN'T GROW", "OUR BUSINESSES BECAUSE", "BANKS WON'T GIVE US LOANS."],
      className: "text-3xl md:text-6xl font-bold text-[#F8EFE2] font-['Oswald'] tracking-[-0.04em] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] text-center"
    }
  ]

  const videos = [
    { id: 1, video: "/videos/moji wo caps.mp4" },
    { id: 2, video: "/videos/Tosin wo caption.mp4" },
    { id: 3, video: "/videos/Habibah wo caps.mp4" },
    { id: 4, video: "/videos/Fali wo caps.mp4" },
    { id: 5, video: "/videos/dunni wo caps.mp4" }
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
      className="min-h-[90vh] relative bg-black overflow-hidden flex items-center justify-center"
    >
      {/* Background with Beams */}
      <div className="absolute inset-0 z-0">
        <BackgroundBeams className="opacity-30" />
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-3xl aspect-video bg-black rounded-lg overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <video
                src={selectedVideo}
                className="w-full h-full"
                controls
                autoPlay
              />
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col items-center w-full gap-12">
          {/* Text Content */}
          <div className="w-full max-w-4xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentTextIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className={texts[currentTextIndex].className}>
                  {texts[currentTextIndex].text.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Video Grid */}
          <div className="w-full max-w-4xl overflow-hidden relative">
            {/* Mobile fade overlays */}
            {isMobile && (
              <>
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
              </>
            )}
            <motion.div 
              className="flex md:grid md:grid-cols-5 gap-3 w-full"
              {...(isMobile ? {
                initial: { x: "0%" },
                animate: { x: "-50%" },
                transition: {
                  x: {
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear",
                  }
                }
              } : {})}
            >
              {/* Double the videos for continuous scroll effect on mobile */}
              {(isMobile ? [...videos, ...videos] : videos).map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-[150px] md:w-auto flex-shrink-0 aspect-square relative rounded-lg overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => setSelectedVideo(item.video)}
                >
                  <video
                    src={item.video}
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4 text-black"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}