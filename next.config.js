/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        pathname: '/secure.notion-static.com/**',
      },
    ],
  },
};

module.exports = nextConfig;
