'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function RetroGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 1.5 // Extra height for perspective
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let frame: number

    const render = () => {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set up perspective transform
      ctx.save()
      ctx.translate(canvas.width / 2, 0)
      ctx.transform(1, 0.2, 0, 1, -canvas.width / 2, 0) // Apply skew for perspective

      // Draw main grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 2

      // Vertical lines
      for (let x = -canvas.width; x < canvas.width * 2; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines with perspective
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath()
        ctx.moveTo(-canvas.width, y)
        ctx.lineTo(canvas.width * 2, y)
        ctx.stroke()
      }

      // Draw smaller grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 1

      // Vertical lines
      for (let x = -canvas.width; x < canvas.width * 2; x += 8) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines with perspective
      for (let y = 0; y < canvas.height; y += 8) {
        ctx.beginPath()
        ctx.moveTo(-canvas.width, y)
        ctx.lineTo(canvas.width * 2, y)
        ctx.stroke()
      }

      ctx.restore()

      frame = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
      {/* Dark gradient overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.4)_100%)]"
      />
      
      {/* Perspective container */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          perspective: '1000px',
          perspectiveOrigin: '50% 50%'
        }}
      >
        {/* Grid canvas with transform */}
        <div
          className="absolute inset-0 w-full h-[150%] origin-top"
          style={{
            transform: 'rotateX(60deg) translateY(-20%)'
          }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>

      {/* Gradient overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
      />
    </div>
  )
} 