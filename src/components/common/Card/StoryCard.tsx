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
        `relative ${bgColor} rounded-[32px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black w-[900px] h-[514px] font-['Oswald'] tracking-[-0.02em] uppercase`,
        className
      )}
    >
      <div className="flex flex-row-reverse items-stretch h-full">
        {/* Image Side */}
        <div className="w-[45%] relative">
          <Image
            src={image}
            alt="Story"
            width={500}
            height={600}
            className="object-cover h-full"
          />
        </div>

        {/* Text Side */}
        <div className="w-[55%] p-12">
          <h3 className="text-4xl md:text-5xl font-bold text-black leading-tight text-left">
            {title}
          </h3>
        </div>
      </div>
    </motion.div>
  )
} 