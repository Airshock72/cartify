import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: 'export',
  basePath: '/cartify',
  assetPrefix: '/cartify/',
  images: {
    unoptimized: true
  },
  trailingSlash: true
}

export default nextConfig
