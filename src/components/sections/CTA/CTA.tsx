'use client'
import { CTACard } from '@/components/common/Card/CTACard'

export function CTA() {
  return (
    <section className="h-[681px] bg-black relative flex items-center [border-top-left-radius:90px] [border-top-right-radius:90px] -mt-20">
      <div className="container mx-auto px-4 py-20">
        <CTACard />
      </div>
    </section>
  )
} 