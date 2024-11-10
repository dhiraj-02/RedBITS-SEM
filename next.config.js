/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['uploadthing.com', 'lh3.googleusercontent.com', 'encrypted-tbn0.gstatic.com', 'res.cloudinary.com'],
  },
  experimental: {
    appDir: true,
  },
  async redirects() {
    return [
      // Redirect any requests to /r/api/* to /api/*
      {
        source: '/r/api/:path*',
        destination: '/api/:path*',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      // Rewrite any requests to /r/api/* to /api/*
      {
        source: '/r/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
