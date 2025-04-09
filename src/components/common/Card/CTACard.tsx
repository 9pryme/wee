'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/common/Button/Button'

export function CTACard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-[#FF4D93] rounded-[32px] p-12 relative overflow-hidden"
    >
      <div className="flex flex-col items-start gap-4 relative z-10 max-w-[600px]">
        <h2 className="text-5xl md:text-7xl font-['Oswald'] font-bold text-white uppercase leading-[0.95]">
          BE PART OF THE MOVEMENT!
        </h2>
        <h3 className="text-4xl md:text-6xl font-['Oswald'] font-bold text-black uppercase leading-[0.95]">
          THOUSANDS ARE CALLING FOR CHANGE.
        </h3>
        <Button 
          variant="primary"
          size="lg"
          className="mt-4 bg-[#ED323D] border-[3px] border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          Join the Petition
        </Button>
      </div>

      {/* Megaphone */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2">
        <div className="relative">
          <Image
            src="/images/megaphone.png"
            alt="Megaphone"
            width={703}
            height={512}
            className="object-contain"
          />
        </div>
      </div>
    </motion.div>
  )
} 