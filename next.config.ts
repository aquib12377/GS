import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Vercel Blob storage
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        // Local dev with Vercel Blob (optional local proxy)
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/**',
      },
    ],
  },
}

export default withPayload(nextConfig)
