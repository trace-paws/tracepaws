/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@radix-ui/react-dialog',
      '@radix-ui/react-select', 
      'lucide-react'
    ]
  },
  
  // Image optimization for photo-heavy application
  images: {
    domains: [
      'yplmrwismtztyomrvzvj.supabase.co',
      'pub-b40d69a6bd20388eb6df9381823ae4b0.r2.dev',
      'b40d69a6bd20388eb6df9381823ae4b0.r2.cloudflarestorage.com'
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection', 
            value: '1; mode=block'
          }
        ]
      }
    ]
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false
      }
    ]
  }
}

module.exports = nextConfig