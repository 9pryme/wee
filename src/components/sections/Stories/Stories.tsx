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
    { id: 1, video: "https://res.cloudinary.com/delpitwkb/video/upload/v1744630877/xgcwcpgpmqitpegvpujk.mp4#t=6.5" },
    { id: 2, video: "https://res.cloudinary.com/delpitwkb/video/upload/v1744630868/s2ujgiox4bheaz68d2cn.mp4#t=6.5" },
    { id: 3, video: "https://res.cloudinary.com/delpitwkb/video/upload/v1744630867/svtfpy6gc0ra1mtgelxa.mp4#t=6.5" },
    { id: 4, video: "https://res.cloudinary.com/delpitwkb/video/upload/v1744630852/mywzouiypacw0dgnacch.mp4#t=6.5" },
    { id: 5, video: "https://res.cloudinary.com/delpitwkb/video/upload/v1744630842/e0el5pkjd4zsgzpkpznx.mp4#t=6.5" }
  ]

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
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
      className="py-20 md:py-32 min-h-[60vh] bg-[#592784] overflow-hidden"
    >
      {/* Video Overlay */}
      {overlayVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <button 
              onClick={() => setOverlayVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X size={32} />
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
      <div className="relative z-10 container mx-auto px-4">
        <div className="h-[100px]" /> {/* Added spacing */}
        <div className="relative flex justify-center">
          <div className="relative w-[90vw] md:w-[80vw]">
            {/* Left Arrow */}
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 p-2 rounded-full text-white hover:bg-black transition-colors"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Right Arrow */}
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 p-2 rounded-full text-white hover:bg-black transition-colors"
            >
              <ChevronRight size={24} />
            </button>

            {/* Left Fade */}
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-[#592784] to-transparent pointer-events-none z-[1]" />

            {/* Right Fade */}
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-[#592784] to-transparent pointer-events-none z-[1]" />

            <div 
              ref={scrollContainerRef}
              className="flex gap-5 overflow-x-auto overflow-y-hidden pb-4 scroll-smooth scrollbar-hide"
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
                    className="w-[400px] sm:w-[450px] h-[300px] sm:h-[350px]"
                    autoPlay={false}
                    muted={true}
                    controls={false}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors rounded-[20px] sm:rounded-[32px]">
                    <div className="bg-white/90 p-3 rounded-full">
                      <Play size={24} className="text-black" />
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