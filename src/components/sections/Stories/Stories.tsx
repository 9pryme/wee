'use client'
import { motion } from 'framer-motion'
import { StoryCard } from '@/components/common/Card/StoryCard'
import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'

export function Stories() {
  const sectionRef = useRef(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [overlayVideo, setOverlayVideo] = useState<string | null>(null)

  const videos = [
    { id: 1, video: "/videos/new/Tosin.mp4", thumbnail: "/thumbnails/13.png" },
    { id: 2, video: "/videos/new/Habibah.mp4", thumbnail: "/thumbnails/7.png" },
    { id: 3, video: "/videos/new/moji.mp4", thumbnail: "/thumbnails/10.png" },
    { id: 4, video: "/videos/new/dunni.mp4", thumbnail: "/thumbnails/3.png" },
    { id: 5, video: "/videos/new/fali.mp4", thumbnail: "/thumbnails/12.png" }
  ]

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 300 : 400 // Smaller scroll amount on mobile
      const newScrollPosition = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <motion.section 
      ref={sectionRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-8 md:py-32 min-h-[40vh] md:min-h-[60vh] bg-[#592784] overflow-hidden"
    >
      {/* Video Overlay */}
      {overlayVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <button 
              onClick={() => setOverlayVideo(null)}
              className="absolute -top-8 sm:-top-12 right-0 text-white hover:text-gray-300"
            >
              <X size={24} className="sm:w-8 sm:h-8" />
            </button>
            <video 
              src={overlayVideo}
              className="w-full h-full rounded-lg"
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-2 sm:px-4">
        <div className="h-[40px] sm:h-[100px]" /> {/* Adjusted spacing for mobile */}
        <div className="relative flex justify-center">
          <div className="relative w-[95vw] sm:w-[90vw] md:w-[80vw]">
            {/* Left Arrow */}
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 p-1.5 sm:p-2 rounded-full text-white hover:bg-black transition-colors"
            >
              <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
            </button>

            {/* Right Arrow */}
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 p-1.5 sm:p-2 rounded-full text-white hover:bg-black transition-colors"
            >
              <ChevronRight size={20} className="sm:w-6 sm:h-6" />
            </button>

            {/* Left Fade */}
            <div className="absolute left-0 top-0 w-12 sm:w-20 h-full bg-gradient-to-r from-[#592784] to-transparent pointer-events-none z-[1]" />

            {/* Right Fade */}
            <div className="absolute right-0 top-0 w-12 sm:w-20 h-full bg-gradient-to-l from-[#592784] to-transparent pointer-events-none z-[1]" />

            <div 
              ref={scrollContainerRef}
              className="flex gap-3 sm:gap-5 overflow-x-auto overflow-y-hidden pb-4 scroll-smooth scrollbar-hide"
            >
              {videos.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  onClick={() => setOverlayVideo(video.video)}
                  className="cursor-pointer flex-shrink-0 relative group"
                >
                  <StoryCard 
                    video={video.video}
                    bgColor="bg-[#FBBD00]"
                    className="w-[280px] xs:w-[320px] sm:w-[450px] h-[210px] xs:h-[240px] sm:h-[350px]"
                    autoPlay={false}
                    muted={true}
                    controls={false}
                    thumbnail={video.thumbnail}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors rounded-[16px] sm:rounded-[32px]">
                    <div className="bg-white/90 p-2 sm:p-3 rounded-full">
                      <Play size={20} className="sm:w-6 sm:h-6 text-black" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}