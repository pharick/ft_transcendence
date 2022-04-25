/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/games',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
