"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import dynamic from 'next/dynamic'
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/common/Button/Button"
import { getOrganizations } from "@/services/banks"
import type { Organization } from "@/services/banks"
import { submitPetition } from '@/services/petition'
import { supabase } from '@/lib/supabase'
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Share2 
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { trackEvent, EventCategory, EventAction } from '@/lib/analytics'
import { trackConversion, getTrackingIdFromUrl } from '@/lib/utm'

// Import Lottie dynamically with SSR disabled
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false
})

interface PetitionFormProps {
  trackingId?: string | null
}

function getOrdinalSuffix(n: number): string {
  const j = n % 10
  const k = n % 100

  if (j === 1 && k !== 11) {
    return n + "st"
  }

  if (j === 2 && k !== 12) {
    return n + "nd"
  }

  if (j === 3 && k !== 13) {
    return n + "rd"
  }

  return n + "th"
}

export function PetitionForm({ trackingId }: PetitionFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: ""
  })
  const [petitionCount, setPetitionCount] = useState(0)
  const [submittedNumber, setSubmittedNumber] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [animation, setAnimation] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    fetch('/images/success.json')
      .then(res => res.json())
      .then(data => setAnimation(data))
      .catch(err => console.error('Error loading animation:', err))
  }, [])

  useEffect(() => {
    trackEvent({
      action: EventAction.SIGN_UP_INITIATED,
      category: EventCategory.PETITION,
      label: 'Petition form viewed'
    })
  }, [])

  const organizationOptions = useMemo(() => {
    if (!organizations.length) return []

    // Filter only banks and sort alphabetically
    const banks = organizations
      .filter(org => org.type === 'bank')
      .sort((a, b) => a.organization_name.localeCompare(b.organization_name))
      .map(org => ({
        value: org.id,
        label: org.organization_name
      }))

    return [{
      label: 'Banks',
      options: banks
    }]
  }, [organizations])

  const loadData = async () => {
    try {
      // Load organizations
      const orgs = await getOrganizations()
      setOrganizations(orgs)

      // Get current petition count
      const { count } = await supabase
        .from('petition_submissions')
        .select('*', { count: 'exact' })
      
      setPetitionCount(count || 0)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data. Please refresh the page.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const newErrors: Record<string, string> = {}
    
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.organization) newErrors.organization = "Bank selection is required"
    
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      try {
        const selectedOrg = organizations.find(org => org.id === formData.organization)
        console.log('Form data:', formData)
        console.log('All organizations:', organizations)
        console.log('Selected organization:', selectedOrg)

        if (!selectedOrg) {
          throw new Error('Selected bank not found')
        }

        const result = await submitPetition({
          name: formData.name,
          email: formData.email,
          organization_id: selectedOrg.id,
          organization_name: selectedOrg.organization_name
        })

        console.log('Petition submission result:', result)

        // Get the new count after submission
        const { count } = await supabase
          .from('petition_submissions')
          .select('*', { count: 'exact' })
        
        setSubmittedNumber(count || 0)
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          organization: ""
        })

        // Track successful submission
        trackEvent({
          action: EventAction.PETITION_SIGNED,
          category: EventCategory.PETITION,
          label: selectedOrg?.organization_name,
          value: submittedNumber ?? undefined
        })

        // Track UTM conversion if tracking ID exists
        const conversionTrackingId = trackingId || getTrackingIdFromUrl()
        if (conversionTrackingId) {
          console.log('Tracking conversion for tracking ID:', conversionTrackingId)
          try {
            await trackConversion(conversionTrackingId)
            console.log('Conversion tracked successfully')
          } catch (error) {
            console.error('Error tracking conversion:', error)
          }
        } else {
          console.log('No tracking ID found for conversion tracking')
        }

        // Show success toast
        toast.success('Petition submitted successfully!')
      } catch (error) {
        console.error('Failed to submit petition:', error)
        toast.error('Failed to submit petition. Please try again.')
      } finally {
        setIsLoading(false)
      }
    } else {
      // Show validation errors
      Object.values(newErrors).forEach(error => {
        toast.error(error)
      })
      setIsLoading(false)
    }
  }

  const shareText = `I just signed a petition to make banks fund women entrepreneurs! I'm the ${getOrdinalSuffix(submittedNumber || 0)} person. Join me and make your voice heard!`
  const shareUrl = "https://weewantmore.ng/petition"

  const handleShare = async () => {
    trackEvent({
      action: EventAction.SHARE_CLICKED,
      category: EventCategory.ENGAGEMENT,
      label: 'native_share'
    })

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Fund Women Entrepreneurs',
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    }
  }

  const handleSocialShare = (platform: 'twitter' | 'facebook' | 'instagram') => {
    trackEvent({
      action: EventAction.SHARE_CLICKED,
      category: EventCategory.ENGAGEMENT,
      label: platform
    })

    const urls = {
      twitter: {
        web: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        app: `twitter://post?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
      },
      facebook: {
        web: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        app: `fb://share?u=${encodeURIComponent(shareUrl)}`
      },
      instagram: {
        web: `https://instagram.com/`,
        app: `instagram://share?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
      }
    }

    try {
      window.location.href = urls[platform].app
      
      setTimeout(() => {
        window.location.href = urls[platform].web
      }, 2000)
    } catch {
      // Fallback to web version if app fails
      window.open(urls[platform].web, '_blank')
    }
  }

  if (submittedNumber !== null) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "relative bg-[#F8EFE2] rounded-[20px] sm:rounded-[32px] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 sm:border-4 border-black w-full max-w-[500px] mx-auto p-4 sm:p-8 min-h-[600px] flex flex-col"
        )}
      >
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 sm:space-y-8">
          <div className="w-32 h-32 sm:w-40 sm:h-40">
            {typeof window !== 'undefined' && animation && (
              <Lottie
                animationData={animation}
                loop={true}
                autoplay
              />
            )}
          </div>

          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Oswald'] font-bold text-black uppercase mb-3 sm:mb-4">
              Thank you for lending your voice
            </h2>
            <h3 className="text-lg sm:text-xl text-black/80 font-montserrat font-bold mb-8 sm:mb-10">
              You are the {getOrdinalSuffix(submittedNumber)} person
            </h3>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 sm:gap-9">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleSocialShare('twitter')}
              className="p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
            >
              <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={() => handleSocialShare('facebook')}
              className="p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
            >
              <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={() => handleSocialShare('instagram')}
              className="p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
            >
              <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 w-full">
            <Button
              variant="primary"
              size="lg"
              onClick={handleShare}
              className="flex items-center justify-center gap-2 min-w-[200px] text-sm sm:text-base"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              Share Now
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative bg-[#F8EFE2] rounded-[20px] sm:rounded-[32px] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 sm:border-4 border-black w-full max-w-[500px] mx-auto p-4 sm:p-8 min-h-[600px]"
      )}
    >
      <div className="mb-6 sm:mb-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Oswald'] font-bold text-black uppercase mb-3 sm:mb-4">
          YOU WILL BE THE <span className="text-[#FF4D93]">{getOrdinalSuffix(petitionCount + 1)}</span> PERSON
        </h2>
        <h3 className="text-lg sm:text-xl text-black/80 font-montserrat">
          Enter your details to send the demands to your bank
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <Input
          label="Your Name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          disabled={isLoading}
        />

        <Input
          label="Your Email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          disabled={isLoading}
        />

        <Select
          label="Select Bank"
          placeholder="Select bank"
          options={organizationOptions}
          value={formData.organization}
          onChange={(e) => {
            const selectedId = e.target.value
            const selectedOrg = organizations.find(org => org.id === selectedId)
            console.log('Selected organization:', selectedOrg)
            setFormData(prev => ({ ...prev, organization: selectedId }))
          }}
          error={errors.organization}
          disabled={isLoading || !organizations.length}
          grouped={true}
        />

        <Button
          variant="primary"
          size="lg"
          bgColor="bg-[#ED323D]"
          className="w-full text-white text-base sm:text-xl"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit your petition'}
        </Button>
      </form>
    </motion.div>
  )
}