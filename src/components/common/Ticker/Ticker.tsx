'use client'
import { motion } from 'framer-motion'

interface TickerProps {
  items: string[];
  duration?: number;
  className?: string;
}

export function Ticker({ items, duration = 60, className = '' }: TickerProps) {
  return (
    <div className="w-full bg-[#ED323D] border-t-[5px] border-t-[#FBBD00] border-b-[5px] border-b-[#592884] overflow-hidden flex items-center justify-center">
      <div className="relative w-full flex items-center justify-center h-full">
        <motion.div
          initial={{ x: "0%" }}
          animate={{ x: "-50%" }}
          transition={{
            x: {
              duration: duration,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            },
          }}
          className="whitespace-nowrap inline-flex items-center justify-center"
        >
          {/* Repeat items 50 times to create seamless loop */}
          {Array(50).fill(items).flat().map((item, i) => (
            <span 
              key={i} 
              className={`inline-flex items-center justify-center px-4 sm:px-8 py-2 sm:py-4 text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold font-oswald ${className}`}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
} 