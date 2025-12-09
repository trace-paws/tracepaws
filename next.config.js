/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove experimental features causing build issues
  experimental: {},
  
  // Image optimization for Cloudflare R2
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-b40d69a6bd20388eb6df9381823ae4b0.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Environment variable configuration
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig