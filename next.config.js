/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.alias['@/components'] = path.resolve(__dirname, '-p/components');
    return config;
  },
};

module.exports = nextConfig;

