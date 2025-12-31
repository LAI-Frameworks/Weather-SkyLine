/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

// Add to next.config.js
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/showcase',
        destination: '/showcase.html',
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
