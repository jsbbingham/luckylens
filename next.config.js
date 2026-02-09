/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Note: Removed 'output: export' to enable API routes for CORS proxy
  // This enables serverless functions on Vercel
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_MAGAYO_API_KEY: process.env.NEXT_PUBLIC_MAGAYO_API_KEY || 'rtAf5eNS3BGdVXh8fr',
    MAGAYO_API_KEY: process.env.MAGAYO_API_KEY || 'rtAf5eNS3BGdVXh8fr',
  },
}

module.exports = nextConfig
