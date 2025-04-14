'use client'
import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const video = {
  src: "https://res.cloudinary.com/delpitwkb/video/upload/v1744481746/draft_1_ljjrvj.mp4"
}

export function PSA() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef)

  useEffect(() => {
    if (!videoRef.current) return

    const playVideo = async () => {
      const videoElement = videoRef.current
      if (!videoElement) return

      try {
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
    <section ref={sectionRef} className="h-screen bg-black relative overflow-hidden">
      {/* Video Player */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isInView ? 1 : 0,
          scale: isInView ? 1 : 0.8
        }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0"
      >
        <video
          ref={videoRef}
          src={video.src}
          className="w-full h-full object-cover"
          playsInline
          loop
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
    </section>
  )
}