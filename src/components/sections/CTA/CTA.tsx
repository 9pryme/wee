'use client'
import { CTACard } from '@/components/common/Card/CTACard'

export function CTA() {
  return (
    <section className="min-h-[400px] md:h-[681px] bg-black relative flex items-center [border-top-left-radius:30px] md:[border-top-left-radius:90px] [border-top-right-radius:30px] md:[border-top-right-radius:90px] -mt-10 md:-mt-20">
      <div className="container mx-auto px-4 py-10 md:py-20">
        <CTACard />
      </div>
    </section>
  )
}