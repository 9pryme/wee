'use client'
import { motion } from 'framer-motion'
import { TestimonialCard } from '@/components/common/Card/TestimonialCard'
import { useState, useEffect } from 'react'

export function Stories2() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <section className="min-h-[40vh] md:min-h-[80vh] relative py-12 md:py-20 bg-white">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-3xl md:text-6xl font-['Oswald'] font-bold text-black uppercase text-center mb-10 md:mb-16 max-w-[1200px] mx-auto px-4"
      >
        NIGERIAN WOMEN <br />
        ARE READY TO GROW
      </motion.h2>
      <div className="relative overflow-hidden">
        <motion.div 
          className="flex gap-4 md:gap-8 px-4"
          animate={{
            x: isMobile ? [0, -1050] : [0, -2100],
          }}
          transition={{
            x: {
              repeat: Infinity,
              duration: isMobile ? 15 : 20,
              ease: "linear",
            },
          }}
          style={{
            width: "fit-content",
            height: isMobile ? "450px" : "550px"
          }}
        >
          {/* First set of cards */}
          <div className="w-[300px] md:w-[1000px] flex-shrink-0">
            <TestimonialCard
              name="Nanaah"
              role="Event Caterer, small chops vendor"
              quote="I need funding to expand my business and produce at scale"
              bgColor="bg-[#B4E9FF]"
              image="/images/testimonials/nanaah.jpg"
            />
          </div>
          <div className="w-[300px] md:w-[1000px] flex-shrink-0">
            <TestimonialCard
              name="Miracle Ademu Eteh"
              role="Fashion entrepreneur"
              quote="I need capital to open a physical fashion store"
              bgColor="bg-[#98E9D0]"
              image="/images/testimonials/miracle.jpg"
            />
          </div>
          <div className="w-[300px] md:w-[1000px] flex-shrink-0">
            <TestimonialCard
              name="Wasinta Buba"
              role="Fashion Designer"
              quote="I need funding to expand my fashion business and open more branches"
              bgColor="bg-[#F8A3BE]"
              image="/images/testimonials/wasinta.jpg"
            />
          </div>
          {/* Duplicate set for seamless loop */}
          <div className="w-[300px] md:w-[1000px] flex-shrink-0">
            <TestimonialCard
              name="Ife"
              role="Hairstylist"
              quote="I need capital to open a salon"
              bgColor="bg-[#B4E9FF]"
              image="/images/testimonials/ife.jpg"
            />
          </div>
          <div className="w-[300px] md:w-[1000px] flex-shrink-0">
            <TestimonialCard
              name="Chef OB"
              role="Chef"
              quote="I need funding to start my culinary school"
              bgColor="bg-[#98E9D0]"
              image="/images/testimonials/chefob.jpg"
            />
          </div>
          <div className="w-[300px] md:w-[1000px] flex-shrink-0">
            <TestimonialCard
              name="AMINA"
              role="Restaurant owner seeking expansion capital"
              quote="My restaurant is always full. I need funding to open a second location but banks won't help."
              bgColor="bg-[#F8A3BE]"
              image="/images/testimonials/amina.jpg"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}