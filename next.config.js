/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/admin/Dashboard'
      }
    ]
  },
  webpack (config) {
    config.experiments = { ...config.experiments, topLevelAwait: true }
    return config
  }
}

module.exports = nextConfig
