/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during build to avoid build failures
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['a.storyblok.com'],
  },
  output: 'standalone',
};

module.exports = nextConfig; 