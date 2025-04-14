'use client'
import { motion, useInView } from 'framer-motion'
import { StoryCard } from '@/components/common/Card/StoryCard'
import { useEffect, useRef } from 'react'

export function Stories() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef)

  useEffect(() => {
    if (!videoRef.current) return

    const playVideo = async () => {
      const videoElement = videoRef.current
      if (!videoElement) return

      try {
        // Always keep video muted to ensure autoplay works on mobile
        videoElement.muted = true
        
        if (isInView) {
          await videoElement.play()
        } else {
          videoElement.pause()
        }
      } catch (error) {
        console.log('Video playback failed:', error)
      }
    }

    playVideo()
  }, [isInView])

  return (
    <motion.section 
      ref={sectionRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-10 md:py-20 bg-[#2ECEB0] overflow-hidden"
    >
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          {/* Story Card */}
          <div className="relative flex flex-col items-center gap-4 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <StoryCard 
                video="https://res.cloudinary.com/delpitwkb/video/upload/v1744481746/draft_1_ljjrvj.mp4"
                bgColor="bg-[#FBBD00]"
                className="w-[95vw] sm:w-[700px] md:w-[900px] lg:w-[1100px] h-auto sm:h-[500px] md:h-[600px]"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}