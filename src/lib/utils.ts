import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const preloadAssets = async () => {
  const assets = {
    images: [
      '/images/left.png',
      '/images/right.png',
      'https://res.cloudinary.com/delpitwkb/image/upload/v1745336920/thumbnail_eirfdn.jpg'
    ],
    videos: [
      'https://res.cloudinary.com/delpitwkb/video/upload/v1745336998/sample_5_tfglxf.mp4'
    ]
  }

  const preloadImage = (src: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(src)
      img.onerror = reject
      img.src = src
    })
  }

  const preloadVideo = (src: string) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.onloadeddata = () => resolve(src)
      video.onerror = reject
      video.src = src
      video.load()
    })
  }

  try {
    await Promise.all([
      ...assets.images.map(src => preloadImage(src)),
      ...assets.videos.map(src => preloadVideo(src))
    ])
    return true
  } catch (error) {
    console.error('Error preloading assets:', error)
    return false
  }
}
