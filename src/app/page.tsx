'use client'
import { Header } from '@/components/layout/Header/Header'
import { Hero3 } from '@/components/sections/Hero/Hero3'
import { Stories2 } from '@/components/sections/Stories/Stories2'
import { Petition } from '@/components/sections/Petition/Petition'
import { CTA } from '@/components/sections/CTA/CTA'
import { Ticker } from '@/components/common/Ticker/Ticker'
import { Footer } from '@/components/layout/Footer/Footer'
import { PSA } from '@/components/sections/PSA/PSA'

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero3 />
        <div className="relative z-50">
          <Ticker 
            items={["WHERE'S OUR MONEY?"]} 
            className="text-2xl font-['Oswald'] font-bold text-center text-white justify-center"
          />
        </div>
        <PSA />
        <Stories2 />
        <Petition />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
