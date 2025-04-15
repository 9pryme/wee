'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/common/Button/Button'
import Link from 'next/link'

export function CTACard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-[#2ECEB0] rounded-[20px] sm:rounded-[32px] p-6 sm:p-12 relative overflow-hidden"
    >
      <div className="flex flex-col items-start gap-3 sm:gap-4 relative z-10 max-w-[600px]">
        <h2 className="text-3xl sm:text-5xl md:text-7xl font-['Oswald'] font-bold text-white uppercase leading-[0.95]">
          BE PART OF THE MOVEMENT!
        </h2>
        <h3 className="text-2xl sm:text-4xl md:text-6xl font-['Oswald'] font-bold text-black uppercase leading-[0.95]">
          THOUSANDS <br className="sm:hidden" />
          ARE CALLING <br className="sm:hidden" />
          FOR CHANGE.
        </h3>
        <Link href="/petition" className="w-full sm:w-auto">
          <Button 
            variant="primary"
            size="lg"
            className="mt-2 sm:mt-4 w-full sm:w-auto bg-[#ED323D] border-[2px] sm:border-[3px] border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Sign the Petition
          </Button>
        </Link>
      </div>

      {/* Megaphone */}
      <div className="absolute -right-24 sm:right-0 top-1/2 -translate-y-1/2 w-[280px] sm:w-auto">
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