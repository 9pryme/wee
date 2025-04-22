'use client'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useRef, useEffect, forwardRef } from 'react'

interface StoryCardProps {
  video: string
  className?: string
  bgColor?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  onEnded?: () => void
}

export const StoryCard = forwardRef<HTMLVideoElement, StoryCardProps>(({ 
  video, 
  className, 
  bgColor = 'bg-[#FBBD00]',
  autoPlay = false,
  muted = true,
  loop = false,
  controls = false,
  onEnded
}, ref) => {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { amount: 0.5 })
  const internalVideoRef = useRef<HTMLVideoElement>(null)
  const combinedRef = (ref || internalVideoRef) as React.RefObject<HTMLVideoElement>

  useEffect(() => {
    if (!combinedRef.current) return

    const playVideo = async () => {
      const videoElement = combinedRef.current
      if (!videoElement) return

      try {
        if (isInView && autoPlay) {
          videoElement.muted = muted
          videoElement.playsInline = true
          const playPromise = videoElement.play()
          if (playPromise !== undefined) {
            playPromise.catch((error: Error) => {
              console.log('Video playback failed:', error)
            })
          }
        } else {
          videoElement.pause()
        }
      } catch (error) {
        console.log('Video playback failed:', error)
      }
    }

    playVideo()
  }, [isInView, autoPlay, muted])

  useEffect(() => {
    const videoElement = combinedRef.current
    if (!videoElement || !onEnded) return

    videoElement.addEventListener('ended', onEnded)
    return () => videoElement.removeEventListener('ended', onEnded)
  }, [onEnded])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={cn(
        `relative ${bgColor} rounded-[20px] sm:rounded-[32px] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 sm:border-4 border-black`,
        className
      )}
    >
      <video
        ref={combinedRef}
        src={video}
        className="w-full h-full object-cover"
        playsInline
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
      />
    </motion.div>
  )
})

StoryCard.displayName = 'StoryCard'