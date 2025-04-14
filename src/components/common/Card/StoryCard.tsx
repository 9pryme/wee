'use client'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useRef, useEffect } from 'react'

interface StoryCardProps {
  video: string
  className?: string
  bgColor?: string
}

export function StoryCard({ video, className, bgColor = 'bg-[#FBBD00]' }: StoryCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { amount: 0.5 }) // Only consider in view when 50% visible

  useEffect(() => {
    if (!videoRef.current) return

    const playVideo = async () => {
      const videoElement = videoRef.current
      if (!videoElement) return

      try {
        if (isInView) {
          // Unmute and play when in view
          videoElement.muted = false
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
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={cn(
        `relative ${bgColor} rounded-[20px] sm:rounded-[32px] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 sm:border-4 border-black w-[90vw] sm:w-[600px] md:w-[700px] lg:w-[900px] h-auto sm:h-[400px] md:h-[514px]`,
        className
      )}
    >
      <video
        ref={videoRef}
        src={video}
        className="w-full h-full object-cover"
        playsInline
        loop
        controls={false}
      />
    </motion.div>
  )
} 