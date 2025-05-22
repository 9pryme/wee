'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { PetitionForm } from '@/components/sections/Petition/PetitionForm'
import { Pause, Play, Volume2, VolumeX, Maximize, Minimize, X } from 'lucide-react'
import Image from 'next/image'
import { trackEvent, EventCategory, EventAction } from '@/lib/analytics'

export function Hero3() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showMobileVideo, setShowMobileVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasTrackedMidpoint = useRef<boolean>(false)

  // Add autoplay when video is ready
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.addEventListener('loadeddata', () => {
        // Video is loaded and ready to play
        video.play().catch(err => {
          console.log("Auto-play failed:", err)
          // Reset playing state if autoplay fails
          setIsPlaying(false)
        })
      })
    }
  }, [])

  const texts = [
    {
      text: ["WE DRIVE 50% OF NIGERIA'S ECONOMY. BUT BANKS GIVE US LESS THAN 10% OF SME LOANS."],
      className: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black font-['Oswald'] tracking-[-0.04em] text-center"
    },
    {
      text: ["62% OF US CAN'T GROW OUR BUSINESSES BECAUSE BANKS WON'T GIVE US LOANS."],
      className: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black font-['Oswald'] tracking-[-0.04em] text-center"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTextIndex(prev => (prev + 1) % texts.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [texts.length])

  const handlePlayPause = () => {
    const video = videoRef.current
    if (video) {
      if (isPlaying) {
        video.pause()
      } else {
        video.play().catch(err => console.log("Play failed:", err))
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMute = () => {
    const video = videoRef.current
    if (video) {
      video.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleFullscreen = () => {
    const videoContainer = document.querySelector('.video-container')
    if (!videoContainer) return

    if (!isFullscreen) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleVideoEvent = (event: string) => {
    const video = videoRef.current
    if (!video) return

    switch(event) {
      case 'play':
        setIsPlaying(true)
        trackEvent({
          action: EventAction.VIDEO_PLAYED,
          category: EventCategory.VIDEO,
          label: 'hero_video'
        })
        break
      case 'pause':
        setIsPlaying(false)
        trackEvent({
          action: EventAction.VIDEO_PAUSED,
          category: EventCategory.VIDEO,
          label: 'hero_video'
        })
        break
      case 'ended':
        setIsPlaying(false)
        trackEvent({
          action: EventAction.VIDEO_COMPLETED,
          category: EventCategory.VIDEO,
          label: 'hero_video'
        })
        break
      case 'timeupdate':
        const progress = (video.currentTime / video.duration) * 100
        if (progress >= 50 && !hasTrackedMidpoint.current) {
          hasTrackedMidpoint.current = true
          trackEvent({
            action: EventAction.VIDEO_PROGRESS,
            category: EventCategory.VIDEO,
            label: 'hero_video_50',
            value: 50
          })
        }
        break
    }
  }

  const handleMobileVideoClose = () => {
    const video = videoRef.current
    if (video) {
      video.pause()
    }
    setIsPlaying(false)
    setShowMobileVideo(false)
  }

  const handleMobileVideoShow = () => {
    setShowMobileVideo(true)
    // Set a small timeout to ensure video element is mounted
    setTimeout(() => {
      const video = videoRef.current
      if (video) {
        video.muted = false
        setIsMuted(false)
        video.play().catch(err => console.log("Mobile play failed:", err))
        setIsPlaying(true)
      }
    }, 100)
  }

  // Mobile layout
  const mobileLayout = (
    <div className="flex flex-col min-h-[90vh] md:hidden">
      {/* Green Section with Text/Video */}
      <div className="relative flex-1 bg-[#2ECEB0]">
        {!showMobileVideo ? (
          <>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '40px 40px'
              }} />
            </div>
            <div className="absolute inset-0 z-0">
              <BackgroundBeams className="opacity-30" />
            </div>

            <div className="relative z-10 w-full h-full px-4 py-12 flex flex-col items-center justify-center">
              <div className="w-full max-w-2xl">
                <div className="flex justify-center mb-8">
                  <Image
                    src="/logo/logo.png"
                    alt="Logo"
                    width={200}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentTextIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4 md:space-y-6"
                  >
                    <div className={texts[currentTextIndex].className}>
                      {texts[currentTextIndex].text.map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                onClick={handleMobileVideoShow}
                className="mt-12 bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Watch Video
              </button>
            </div>
          </>
        ) : (
          <div className="relative w-full h-full">
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              controls={false}
              src="https://res.cloudinary.com/dagqvkkto/video/upload/v1747910985/Official_PSA_jlbzcp.mp4"
              onPlay={() => handleVideoEvent('play')}
              onPause={() => handleVideoEvent('pause')}
              onEnded={() => handleVideoEvent('ended')}
              onTimeUpdate={() => handleVideoEvent('timeupdate')}
            />
            
            {/* Video Controls */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-b from-black/50 to-black/50">
              <button
                onClick={handleMobileVideoClose}
                className="self-end bg-white/20 p-2 rounded-full"
              >
                <X size={24} color="white" />
              </button>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePlayPause}
                  className="bg-white/20 p-3 rounded-full"
                >
                  {isPlaying ? <Pause size={24} color="white" /> : <Play size={24} color="white" />}
                </button>
                
                <button
                  onClick={handleMute}
                  className="bg-white/20 p-3 rounded-full"
                >
                  {isMuted ? <VolumeX size={24} color="white" /> : <Volume2 size={24} color="white" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Petition Form Section */}
      <div className="relative bg-[#FFB53A] p-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }} />
        </div>
        <div className="relative z-10">
          <PetitionForm />
        </div>
      </div>
    </div>
  )

  // Desktop layout remains unchanged
  const desktopLayout = (
    <div className="hidden md:flex flex-row min-h-[90vh]">
      {/* Left Section */}
      <div className="flex-[1] relative overflow-hidden border-r-4 border-black">
        {/* Video Section */}
        <div className="video-container w-full h-1/2 relative z-10 border-b-4 border-black">
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            loop 
            muted={isMuted}
            playsInline
            controls={false}
            src="https://res.cloudinary.com/dagqvkkto/video/upload/v1747910985/Official_PSA_jlbzcp.mp4"
            onPlay={() => handleVideoEvent('play')}
            onPause={() => handleVideoEvent('pause')}
            onEnded={() => handleVideoEvent('ended')}
            onTimeUpdate={() => handleVideoEvent('timeupdate')}
          />
          {/* Center Play Button */}
          {!isPlaying && (
            <button
              onClick={handlePlayPause}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 p-8 rounded-full hover:bg-white transition-colors"
              aria-label="Play video"
            >
              <Play size={40} />
            </button>
          )}
          {/* Controls only shown when video is playing */}
          {isPlaying && (
            <div className="absolute bottom-4 w-full px-4 flex justify-between">
              <div className="flex gap-2">
                <button
                  onClick={handlePlayPause}
                  className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                  aria-label="Pause video"
                >
                  <Pause size={20} />
                </button>
                <button
                  onClick={handleMute}
                  className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>
              <button
                onClick={handleFullscreen}
                className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </div>
          )}
          {/* Fullscreen Help Text */}
          {isFullscreen && (
            <div className="absolute top-4 left-4 text-white/80 text-sm bg-black/40 px-3 py-1 rounded-full">
              Press ESC to exit fullscreen
            </div>
          )}
          {/* Petition Form Overlay in Fullscreen */}
          {isFullscreen && (
            <div className="absolute bottom-20 right-8 w-1/3 z-50">
              <PetitionForm />
            </div>
          )}
        </div>

        {/* Green Section with Text */}
        <div className="relative h-1/2 bg-[#2ECEB0]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px'
            }} />
          </div>
          <div className="absolute inset-0 z-0">
            <BackgroundBeams className="opacity-30" />
          </div>

          <div className="relative z-10 w-full h-full px-4 py-8 flex items-center justify-center">
            <div className="w-full max-w-2xl pl-8">
              <div className="flex justify-center mb-8">
                <Image
                  src="/logo/logo.png"
                  alt="Logo"
                  width={200}
                  height={80}
                  className="object-contain"
                />
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentTextIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-2 md:space-y-4"
                >
                  <div className={texts[currentTextIndex].className}>
                    {texts[currentTextIndex].text.map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Only shown when not in fullscreen */}
      {!isFullscreen && (
        <div className="flex-1 relative overflow-hidden bg-[#FFB53A]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }} />
          </div>
          <div className="absolute left-0 bottom-0 z-20">
            <Image
              src="/images/left.png"
              alt="Left decoration"
              width={200}
              height={400}
              className="object-contain"
            />
          </div>
          <div className="absolute right-0 bottom-0 z-20">
            <Image
              src="/images/right.png"
              alt="Right decoration"
              width={200}
              height={400}
              className="object-contain"
            />
          </div>
          <div className="relative z-10 px-4 py-8 mt-20 md:mt-32">
            <div className="max-w-xl mx-auto">
              <PetitionForm />
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {mobileLayout}
      {desktopLayout}
    </>
  )
}