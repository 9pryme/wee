'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface StoryCardProps {
  title: string
  image: string
  className?: string
  bgColor?: string
}

export function StoryCard({ title, image, className, bgColor = 'bg-[#FBBD00]' }: StoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={cn(
        `relative ${bgColor} rounded-[20px] sm:rounded-[32px] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 sm:border-4 border-black w-[90vw] sm:w-[600px] md:w-[700px] lg:w-[900px] h-auto sm:h-[400px] md:h-[514px] font-['Oswald'] tracking-[-0.02em] uppercase`,
        className
      )}
    >
      <div className="flex flex-col sm:flex-row-reverse items-stretch h-full">
        {/* Image Side */}
        <div className="w-full h-[200px] sm:h-auto sm:w-[45%] relative">
          <Image
            src={image}
            alt="Story"
            width={500}
            height={600}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Text Side */}
        <div className="w-full sm:w-[55%] p-6 sm:p-8 md:p-12">
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight text-left">
            {title}
          </h3>
        </div>
      </div>
    </motion.div>
  )
} 