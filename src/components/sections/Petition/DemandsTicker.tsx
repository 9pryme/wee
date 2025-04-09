'use client'
import { motion } from 'framer-motion'
import { Card } from '@/components/common/Card/Card'

const demands = [
  {
    number: "1",
    title: "Increase funding allocation for women-owned businesses",
    borderColor: "#2ECEB0",
    bgColor: "#E8F9F5"
  },
  {
    number: "2",
    title: "Develop women-focused financial products",
    borderColor: "#2ECEB0",
    bgColor: "#E8F9F5"
  },
  {
    number: "3",
    title: "Simplify loan application processes",
    borderColor: "#2ECEB0",
    bgColor: "#E8F9F5"
  },
  {
    number: "4",
    title: "Provide business development support",
    borderColor: "#2ECEB0",
    bgColor: "#E8F9F5"
  }
]

export function DemandsTicker() {
  return (
    <div className="w-[400px] overflow-hidden">
      <motion.div
        initial={{ y: "0%" }}
        animate={{ y: "-50%" }}
        transition={{
          y: {
            duration: 20,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          },
        }}
        className="flex flex-col gap-4"
      >
        {/* Double the items to create seamless loop */}
        {[...demands, ...demands].map((demand, index) => (
          <div key={index}>
            <Card
              number={demand.number}
              title={demand.title}
              borderColor={demand.borderColor}
              bgColor={demand.bgColor}
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
} 