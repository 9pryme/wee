'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { StoryCard } from '@/components/common/Card/StoryCard'
import { useState } from 'react'

export function Stories() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const stories = [
    {
      title: "41% of us need startup funding, but we're overlooked.",
      image: "/images/women.png",
      bgColor: "bg-[#FBBD00]"
    },
    {
      title: "We drive innovation but lack financial support.",
      image: "/images/women.png",
      bgColor: "bg-[#98E9D0]"
    },
    {
      title: "Our businesses could thrive with proper funding.",
      image: "/images/women.png",
      bgColor: "bg-[#FFB4E9]"
    }
  ]

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
      className="min-h-screen relative flex items-center justify-center py-20 bg-[#2ECEB0] overflow-hidden"
    >
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">

          {/* Story Cards and Navigation */}
          <div className="relative flex flex-col items-center gap-8">
            <StoryCard 
              title={stories[currentIndex].title}
              image={stories[currentIndex].image}
              bgColor={stories[currentIndex].bgColor}
            />

            {/* Navigation Dots */}
            <div className="flex gap-4 mb-6">
              {stories.map((story, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-12 h-12 rounded-full border-2 border-black overflow-hidden transition-all ${
                    currentIndex === index ? 'scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'opacity-50'
                  }`}
                >
                  <Image
                    src={story.image}
                    alt={`Story ${index + 1}`}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex gap-4">
              <button 
                onClick={prevSlide}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black hover:bg-gray-100"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <button 
                onClick={nextSlide}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black hover:bg-gray-100"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}