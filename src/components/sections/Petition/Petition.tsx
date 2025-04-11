'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/common/Button/Button'
import { Card } from '@/components/common/Card/Card'
import Link from 'next/link'

export function Petition() {
  const demands = [
    {
      number: "01",
      title: "Create or expand dedicated women's business credit fund with friendly-interest rates",
      borderColor: "#FFB53A", 
      bgColor: "#FFF8E7"
    },
    {
      number: "02",
      title: "Reserve 40% of your MSME loan portfolio to women and simplify collateral requirements",
      borderColor: "#ED323D",
      bgColor: "#FFE5F0"
    },
    {
      number: "03", 
      title: "Mandate 30% gender-based lending targets for commercial banks",
      borderColor: "#FF623E",
      bgColor: "#FFF0F0"
    },
    {
      number: "04",
      title: "Reserve 50% of government MSME intervention funds exclusively for women.",
      borderColor: "#592884",
      bgColor: "#F5E6FF"
    }
  ]

  return (
    <section className="min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg/Section-bg2.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-10 sm:py-20">
        <div className="text-center mb-8 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="inline-block bg-[#ED323D] text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-8 font-montserrat text-xs sm:text-base"
          >
            DEAR BANK CEOS AND POLICYMAKERS
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl sm:text-4xl md:text-6xl font-['Oswald'] font-bold tracking-[-0.04em] uppercase text-black mb-2 sm:mb-4"
          >
            Women Repay Over 95% of Their Loans
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-xl sm:text-4xl md:text-6xl font-['Oswald'] font-bold tracking-[-0.04em] uppercase text-black"
          >
            What More Proof Do You Need?
          </motion.h3>
        </div>

        <div className="bg-white rounded-[20px] sm:rounded-[32px] border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] px-4 sm:px-10 py-6 sm:py-8 bg-[url('/images/bank-bg.png')] bg-cover bg-center">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 sm:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="w-full md:w-1/3"
              >
                <h4 className="text-2xl sm:text-3xl md:text-[48px] leading-[1.1] font-montserrat text-gray-900 mb-4 sm:mb-8 font-extrabold italic max-w-[590px] tracking-[-0.03em]">
                  We want you to publicly commit to
                </h4>
                <Link href="/petition" className="hidden md:block w-full sm:w-auto">
                  <Button 
                    variant="primary"
                    size="lg"
                    className="mt-4 w-full sm:w-auto text-sm sm:text-base"
                  >
                    Sign the Petition
                  </Button>
                </Link>
              </motion.div>

              <div className="flex flex-col gap-4 sm:gap-8 w-full md:w-2/3 items-stretch md:items-end">
                {demands.map((demand, index) => (
                  <Card
                    key={index}
                    number={demand.number}
                    title={demand.title}
                    borderColor={demand.borderColor}
                    bgColor={demand.bgColor}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </div>

            <Link href="/petition" className="block md:hidden w-full mt-8">
              <Button 
                variant="primary"
                size="lg"
                className="w-full text-sm sm:text-base"
              >
                Sign the Petition
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}