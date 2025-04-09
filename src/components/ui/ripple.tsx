"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface RippleProps {
  color?: string
  size?: number
  duration?: number
  className?: string
}

export function Ripple({ 
  color = "rgba(3, 3, 3, 0.97)", 
  size = 100,
  duration = 6,
  className = ""
}: RippleProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setRipples((prev) => [
        ...prev,
        {
          x: Math.random() * 100,
          y: Math.random() * 100,
          id: Date.now(),
        },
      ])
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (ripples.length > 0) {
      const timeout = setTimeout(() => {
        setRipples((prev) => prev.slice(1))
      }, duration * 1000)

      return () => clearTimeout(timeout)
    }
  }, [ripples, duration])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5, x: `${ripple.x}%`, y: `${ripple.y}%` }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration, ease: "linear" }}
          className="absolute"
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: color,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  )
} 