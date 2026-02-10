/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  webpack: {
    externals: {
      'google-maps': 'google-maps',
    },
  },
};

module.exports = nextConfig;
