'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface TestimonialCardProps {
  name: string
  role: string
  quote: string
  image: string
  className?: string
  bgColor?: string
}

export function TestimonialCard({ name, role, quote, image, className, bgColor = 'bg-[#B4E9FF]' }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={cn(
        `${bgColor} rounded-[20px] sm:rounded-[32px] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 sm:border-4 border-black w-[300px] sm:w-[1000px] h-[400px] sm:h-auto`,
        className
      )}
    >
      <div className="flex flex-col sm:flex-row items-stretch h-full">
        {/* Text Side */}
        <div className="flex-1 p-4 sm:p-12">
          <div className="space-y-3 sm:space-y-6">
            <div>
              <h3 className="text-xl sm:text-4xl font-['Oswald'] font-bold text-black uppercase">
                {name}
              </h3>
              <p className="text-sm sm:text-lg text-black/80 italic font-montserrat mt-1">
                {role}
              </p>
            </div>
            <div className="relative">
              <p className="text-lg sm:text-2xl font-['Oswald'] text-black leading-tight">
                {quote}
              </p>
            </div>
          </div>
        </div>

        {/* Image Side - At Bottom on Mobile, Right on Desktop */}
        <div className="w-full h-[160px] sm:h-[514px] sm:w-[40%] relative p-4 sm:p-8 ">
          <div className="relative h-full w-full rounded-[12px] sm:rounded-[24px] overflow-hidden">
            <Image
              src={image}
              alt={name}
              fill
              sizes="400px"
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
} 