'use client'
import { motion } from 'framer-motion'
import { StoryCard } from '@/components/common/Card/StoryCard'
import { useState, useEffect } from 'react'

export function Stories() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const stories = [
    {
      title: "41% of us need startup funding, but we're overlooked.",
      image: "/images/testimonials/DSC05760.jpg",
      bgColor: "bg-[#FBBD00]"
    },
    {
      title: "We drive innovation but lack financial support.",
      image: "/images/testimonials/1.png", 
      bgColor: "bg-[#98E9D0]"
    },
    {
      title: "Our businesses could thrive with proper funding.",
      image: "/images/testimonials/2x.png",
      bgColor: "bg-[#FFB4E9]",
      imageClassName: "object-right"
    }
  ]

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Auto advance slides every 5 seconds in a loop
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [stories.length]) // Added stories.length as dependency

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length)
  }

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="min-h-[80vh] md:min-h-screen relative flex items-center justify-center py-10 md:py-20 bg-[#2ECEB0] overflow-hidden"
    >
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">

          {/* Story Cards and Navigation */}
          <div className="relative flex flex-col items-center gap-4 md:gap-8">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ 
                duration: 0.5,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 4.5 // Slightly less than the interval to ensure smooth transition
              }}
            >
              <StoryCard 
                title={stories[currentIndex].title}
                image={stories[currentIndex].image}
                bgColor={stories[currentIndex].bgColor}
                className={`w-[95vw] sm:w-[700px] md:w-[900px] lg:w-[1100px] h-auto sm:h-[500px] md:h-[600px] ${stories[currentIndex].imageClassName || ''}`}
              />
            </motion.div>

            {/* Navigation Arrows */}
            <div className="flex gap-2 md:gap-4">
              <motion.button 
                onClick={prevSlide}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ 
                  x: [0, -5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black hover:bg-gray-100 active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
              >
                <svg width={isMobile ? "20" : "24"} height={isMobile ? "20" : "24"} viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>

              <motion.button 
                onClick={nextSlide}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ 
                  x: [0, 5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black hover:bg-gray-100 active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
              >
                <svg width={isMobile ? "20" : "24"} height={isMobile ? "20" : "24"} viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}