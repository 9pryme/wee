'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface TestimonialCardProps {
  name: string
  role: string
  quote: string
  className?: string
  bgColor?: string
}

export function TestimonialCard({ name, role, quote, className, bgColor = 'bg-[#B4E9FF]' }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={cn(
        `${bgColor} rounded-[32px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black w-[1000px] h-[514px]`,
        className
      )}
    >
      <div className="flex items-stretch h-full">
        {/* Text Side */}
        <div className="flex-1 p-12">
          <div className="space-y-6">
            <div>
              <h3 className="text-4xl font-['Oswald'] font-bold text-black uppercase">
                {name}
              </h3>
              <p className="text-lg text-black/80 italic font-montserrat mt-1">
                {role}
              </p>
            </div>
            <div className="relative">
              <p className="text-2xl font-['Oswald'] text-black leading-tight">
                {quote}
              </p>
            </div>
          </div>
        </div>

        {/* Image Side */}
        <div className="w-[40%] relative bg-black/5">
          <div className="absolute inset-0 rounded-r-[28px] overflow-hidden">
            <Image
              src="/images/aisha.jpg"
              alt={name}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
} 