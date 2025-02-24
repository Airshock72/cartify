import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  basePath: '/shopping-cart',
  assetPrefix: '/shopping-cart/',
  images: {
    unoptimized: true
  },
  trailingSlash: true
}

export default nextConfig
