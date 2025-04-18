'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { SearchBar } from '@/components/common/SearchBar/SearchBar'
import { BankCard } from '@/components/common/Card/BankCard'
import { Button } from '@/components/common/Button/Button'
import Link from 'next/link'

export function BankList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [filteredBanks, setFilteredBanks] = useState<typeof banks>([])

  const banks = Array(20).fill({
    name: "Name of Bank",
    description: "Brief text stating how much they have committed to this",
  })

  useEffect(() => {
    setIsSearching(true)
    const timer = setTimeout(() => {
      const results = banks.filter(bank =>
        bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bank.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredBanks(results)
      setIsSearching(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, banks])

  return (
    <section className="min-h-screen bg-[#2ECEB0] py-12 sm:py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl md:text-7xl font-['Oswald'] font-bold text-black uppercase mb-8 sm:mb-12"
        >
          IS YOUR BANK HERE?
        </motion.h2>

        <div className="bg-white rounded-[20px] sm:rounded-[32px] border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-8 bg-[url('/images/bank-bg.png')] bg-cover bg-center">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 sm:gap-8 mb-8 sm:mb-12">
            <div className="w-full md:max-w-[500px]">
              <p className="text-lg sm:text-xl font-montserrat text-black mb-4">
                Banks on this list have committed to this cause. If your bank is not here, Join the petition and they&apos;ll be notified.
              </p>
              <Link href="/petition" className="w-full sm:w-auto block">
                <Button 
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto bg-[#ED323D] text-white border-[2px] sm:border-[3px] border-black hover:bg-[#d62d37] transition-colors"
                >
                  Join the Petition
                </Button>
              </Link>
            </div>
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-full md:w-[400px]"
            />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-montserrat text-black mb-6 sm:mb-8">
              Banks that have joined the cause
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {isSearching ? (
                <div className="col-span-full flex justify-center items-center min-h-[150px] sm:min-h-[200px]">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 border-3 sm:border-4 border-[#2ECEB0] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                filteredBanks.map((bank, index) => (
                  <BankCard
                    key={index}
                    name={bank.name}
                    description={bank.description}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}