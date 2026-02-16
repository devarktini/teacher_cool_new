/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', "logo.clearbit.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
      },
    ]
  },
    trailingSlash: true,
}

module.exports = nextConfig
