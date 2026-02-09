/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // For dev server deployment - adjust as needed
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
  env: {
    NEXT_PUBLIC_MAGAYO_API_KEY: process.env.NEXT_PUBLIC_MAGAYO_API_KEY || 'rtAf5eNS3BGdVXh8fr',
  },
}

module.exports = nextConfig
