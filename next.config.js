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
    serverActions: true,
  },
}

module.exports = nextConfig 