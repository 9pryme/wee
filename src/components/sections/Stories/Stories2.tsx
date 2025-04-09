'use client'
import { motion } from 'framer-motion'
import { TestimonialCard } from '@/components/common/Card/TestimonialCard'

export function Stories2() {
  return (
    <section className="min-h-screen relative py-22 bg-white">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-6xl font-['Oswald'] font-bold text-black uppercase text-center mb-20 max-w-[1200px] mx-auto px-4"
      >
        NIGERIAN WOMEN <br />
        ARE READY TO GROW
      </motion.h2>
      <div className="relative overflow-hidden">
        <motion.div 
          className="flex gap-8 px-4"
          animate={{
            x: [0, -2100], // Reduced animation distance
          }}
          transition={{
            x: {
              repeat: Infinity,
              duration: 20, // Reduced duration
              ease: "linear",
            },
          }}
          style={{
            width: "fit-content",
            height: "550px" // Reduced height
          }}
        >
          {/* First set of cards */}
          <div className="w-[1000px] flex-shrink-0">
            <TestimonialCard
              name="AISHA"
              role="IT entrepreneur denied funding for her startup"
              quote="They said an IT firm is high-risk. But I already have paying clients. What's the risk in funding what's already working?"
              bgColor="bg-[#B4E9FF]"
            />
          </div>
          <div className="w-[1000px] flex-shrink-0">
            <TestimonialCard
              name="CHIOMA"
              role="Fashion designer who can't access capital"
              quote="Fashion is a billion-naira market. So why do banks refuse to see my potential?"
              bgColor="bg-[#98E9D0]"
            />
          </div>
          <div className="w-[1000px] flex-shrink-0">
            <TestimonialCard
              name="AMINA"
              role="Restaurant owner seeking expansion capital"
              quote="My restaurant is always full. I need funding to open a second location but banks won't help."
              bgColor="bg-[#FFD9B4]"
            />
          </div>
          {/* Duplicate set for seamless loop */}
          <div className="w-[1000px] flex-shrink-0">
            <TestimonialCard
              name="AISHA"
              role="IT entrepreneur denied funding for her startup"
              quote="They said an IT firm is high-risk. But I already have paying clients. What's the risk in funding what's already working?"
              bgColor="bg-[#B4E9FF]"
            />
          </div>
          <div className="w-[1000px] flex-shrink-0">
            <TestimonialCard
              name="CHIOMA"
              role="Fashion designer who can't access capital"
              quote="Fashion is a billion-naira market. So why do banks refuse to see my potential?"
              bgColor="bg-[#98E9D0]"
            />
          </div>
          <div className="w-[1000px] flex-shrink-0">
            <TestimonialCard
              name="AMINA"
              role="Restaurant owner seeking expansion capital"
              quote="My restaurant is always full. I need funding to open a second location but banks won't help."
              bgColor="bg-[#FFD9B4]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}