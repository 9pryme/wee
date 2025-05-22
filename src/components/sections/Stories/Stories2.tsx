'use client'
import { motion } from 'framer-motion'
import { TestimonialCard } from '@/components/common/Card/TestimonialCard'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

// Move testimonials outside the component to avoid recreation on each render
const testimonials = [
  {
    name: "Nanaah",
    role: "Event Caterer, small chops vendor",
    quote: "I need funding to expand my business and produce at scale",
    bgColor: "bg-[#B4E9FF]",
    image: "/images/testimonials/nanaah.jpg",
    video: "https://drive.google.com/file/d/1wr3P3KkwVNYPdopoF7Y45u2f3YYT0L-9/view?usp=drive_link"
  },
  {
    name: "Miracle Ademu Eteh",
    role: "Fashion entrepreneur",
    quote: "I need capital to open a physical fashion store",
    bgColor: "bg-[#98E9D0]",
    image: "/images/testimonials/miracle.jpg",
    video: "https://drive.google.com/file/d/1jAijbDTvlWT8ZjqA3_vFcDQ7VfiOBhLe/view?usp=drive_link"
  },
  {
    name: "Wasinta Buba",
    role: "Fashion Designer", 
    quote: "I need funding to expand my fashion business and open more branches",
    bgColor: "bg-[#F8A3BE]",
    image: "/images/testimonials/wasinta.jpg",
    video: "https://drive.google.com/file/d/1QVuQ_8hkF5MZ6ggBlVamibHVmz4Vm7iy/view?usp=drive_link"
  },
  {
    name: "Ife",
    role: "Hairstylist",
    quote: "I need capital to open a salon",
    bgColor: "bg-[#B4E9FF]",
    image: "/images/testimonials/ife.jpg",
    video: "https://drive.google.com/file/d/1eBpXeZCz7eB3tRgy9k-IAi9jokR9whre/view?usp=drive_link"
  },
  {
    name: "Chef OB",
    role: "Chef",
    quote: "I need funding to start my culinary school",
    bgColor: "bg-[#98E9D0]",
    image: "/images/testimonials/chefob.jpg",
    video: "https://drive.google.com/file/d/1SmUzDekhZN_-feKPOGVcCU_gGzU7j5GQ/view?usp=drive_link"
  }
]

export function Stories2() {
  const [isMobile, setIsMobile] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [preloadedVideos, setPreloadedVideos] = useState<{[key: string]: string}>({})

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Preload videos when component mounts
  useEffect(() => {
    const preloadVideos = async () => {
      const videoUrls: {[key: string]: string} = {}
      
      for (const testimonial of testimonials) {
        const embedUrl = getGoogleDriveEmbedUrl(testimonial.video)
        videoUrls[testimonial.video] = embedUrl
      }

      setPreloadedVideos(videoUrls)
    }

    preloadVideos()
  }, []) // No need to add testimonials as dependency since it's now defined outside the component

  const getGoogleDriveEmbedUrl = (url: string) => {
    const fileId = url.match(/[-\w]{25,}/)
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId[0]}/preview`
    }
    return url
  }

  return (
    <section className="min-h-[40vh] md:min-h-[80vh] relative py-12 md:py-20 bg-[#ED323D]">
      {/* Hidden iframes to preload videos */}
      <div className="hidden">
        {Object.values(preloadedVideos).map((url, i) => (
          <iframe key={i} src={url} />
        ))}
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-[400px] aspect-[9/16]">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X size={32} />
            </button>
            <iframe
              src={preloadedVideos[selectedVideo] || getGoogleDriveEmbedUrl(selectedVideo)}
              className="w-full h-full rounded-lg"
              allow="autoplay"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-3xl md:text-6xl font-['Oswald'] font-bold text-white uppercase text-center mb-10 md:mb-16 max-w-[1200px] mx-auto px-4"
      >
        NIGERIAN WOMEN <br />
        ARE READY TO GROW
      </motion.h2>
      <div className="relative overflow-hidden">
        <motion.div 
          className="flex gap-4 md:gap-8 px-4"
          animate={{
            x: isMobile ? [-1050, 0] : [-3000, 0],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: isMobile ? 30 : 40,
              ease: "linear",
            },
          }}
          style={{
            width: "fit-content",
            height: isMobile ? "450px" : "550px"
          }}
        >
          {/* Triple the testimonials for smoother infinite scroll */}
          {[...testimonials, ...testimonials, ...testimonials].map((testimonial, i) => (
            <div key={i} className="w-[300px] md:w-[1000px] flex-shrink-0">
              <TestimonialCard
                name={testimonial.name}
                role={testimonial.role}
                quote={testimonial.quote}
                bgColor={testimonial.bgColor}
                image={testimonial.image}
                onClick={() => setSelectedVideo(testimonial.video)}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}