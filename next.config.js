/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/delpitwkb/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      enabled: true
    }
  },
}

module.exports = nextConfig 