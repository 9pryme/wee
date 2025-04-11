'use client'
import { motion, useScroll } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/common/Button/Button'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export function Header() {
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [isScrolled, setIsScrolled] = useState(false)
    const { scrollY } = useScroll()

    useEffect(() => {
        // Subscribe to scroll value updates
        const unsubscribe = scrollY.on("change", (latest) => {
            // Hide header when scrolling down, show when scrolling up
            if (latest > lastScrollY) {
                setIsVisible(false)
            } else {
                setIsVisible(true)
            }

            // Add background when scrolled
            setIsScrolled(latest > 50)
            setLastScrollY(latest)
        })

        return () => {
            unsubscribe()
        }
    }, [lastScrollY, scrollY])

    return (
        <motion.header 
            initial={{ y: -100 }}
            animate={{ 
                y: isVisible ? 0 : -100,
            }}
            transition={{ duration: 0.3 }}
            style={{
                backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
            }}
            className={`fixed w-full top-0 z-50 transition-all duration-300 ${
                isScrolled ? 'backdrop-blur-md shadow-md' : ''
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <Image 
                            src="/logo/logo.png" 
                            alt="Logo" 
                            width={200} 
                            height={60}
                            className="w-auto h-12 transition-opacity duration-300" 
                            priority
                        />
                    </Link>

                    {/* CTA Button */}
                    <div>
                        <Link href="/petition">
                            <Button 
                                variant="primary" 
                                size="sm"
                                bgColor="bg-[#ED323D]"
                                className="border-[#050F0F] text-white hover:bg-[#d62932] transition-colors"
                            >
                                Sign the Petition
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.header>
    )
}