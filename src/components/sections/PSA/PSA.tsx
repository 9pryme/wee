'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Video {
  id: number
  src: string
  title: string
}

const videos: Video[] = [
  { id: 1, src: "/videos/dunni wo caps.mp4", title: "Video 1" },
  { id: 2, src: "/videos/dunni wo caps.mp4", title: "Video 2" },
  { id: 3, src: "/videos/dunni wo caps.mp4", title: "Video 3" },
  { id: 4, src: "/videos/dunni wo caps.mp4", title: "Video 4" }
]

export function PSA() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Handle video end
  const handleVideoEnd = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
  }

  // Handle video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Skip to next video
  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
  }

  // Skip to previous video
  const previousVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length)
  }

  return (
    <section className="h-screen bg-black relative overflow-hidden">
      {/* Video Player */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVideoIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <video
            ref={videoRef}
            src={videos[currentVideoIndex].src}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            onEnded={handleVideoEnd}
          />
        </motion.div>
      </AnimatePresence>

      {/* Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60">
        {/* Video Progress */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <motion.div
            className="h-full bg-white"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: videoRef.current?.duration || 0,
              ease: "linear",
              repeat: 0
            }}
          />
        </div>

        {/* Control Buttons */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <button
            onClick={previousVideo}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isPlaying ? (
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            )}
          </button>

          <button
            onClick={nextVideo}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Video Counter */}
        <div className="absolute top-8 right-8 text-white font-montserrat">
          <span className="text-2xl font-bold">{currentVideoIndex + 1}</span>
          <span className="text-xl opacity-60">/{videos.length}</span>
        </div>
      </div>
    </section>
  )
} 