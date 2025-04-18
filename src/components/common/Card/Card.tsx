'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps {
  number: string;
  title: string;
  className?: string;
  delay?: number;
  borderColor?: string;
  bgColor?: string;
  numberStyles?: {
    borderWidth?: string;
    borderColor?: string;
    backgroundColor?: string;
  };
}

export function Card({ 
  number, 
  title, 
  className, 
  delay = 0,
  borderColor = "#FF9898",
  bgColor = "#FFF0F0",
  numberStyles
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      className={cn(
        "relative rounded-[8px] sm:rounded-[12px] p-4 sm:p-8 border-2 sm:border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-[590px]",
        className
      )}
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor
      }}
    >
      <div className="flex items-start gap-2 sm:gap-4">
        <div 
          className="text-3xl sm:text-[64px] font-['Oswald'] font-bold" 
          style={{ 
            color: borderColor,
            ...numberStyles
          }}
        >
          {number.padStart(2, '0')}
        </div>
        <h3 className="text-xl sm:text-3xl font-['Oswald'] font-bold text-black mt-2 sm:mt-4 leading-tight">
          {title}
        </h3>
      </div>
    </motion.div>
  )
}