'use client'
import { motion } from 'framer-motion'

interface BankCardProps {
  name: string
  description: string
  className?: string
}

export function BankCard({ name, description, className }: BankCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={`bg-white rounded-[12px] p-4 sm:p-6 border-2 border-black/10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 ${className}`}
    >
      <div className="w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] rounded-full bg-black flex items-center justify-center relative aspect-square">
        <span className="text-xl sm:text-2xl font-['Oswald'] font-bold text-white">
          {name.charAt(0)}
        </span>
        {/* Green checkmark circle */}
        <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#2ECEB0] rounded-full border-2 border-black flex items-center justify-center aspect-square">
          <svg width="10" height="10" className="sm:w-[12px] sm:h-[12px]" viewBox="0 0 12 12" fill="none">
            <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <div className="text-center sm:text-left">
        <h3 className="text-lg sm:text-xl font-['Oswald'] font-bold text-black">{name}</h3>
        <p className="text-xs sm:text-sm text-black/90 font-montserrat">{description}</p>
      </div>
    </motion.div>
  )
} 