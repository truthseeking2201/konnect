/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.jsdelivr.net'],
  },
  webpack: (config) => {
    // Optional: Add bundle analyzer in production build
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: './analyze/bundle-report.html',
        })
      );
    }
    return config;
  },
  // Handle Content Security Policy based on environment
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    
    return [
      {
        source: '/:path*', // applies to all routes
        headers: [
          {
            key: 'Content-Security-Policy',
            value: isDev 
              ? "script-src 'self' 'unsafe-eval' cdn.jsdelivr.net"
              : "script-src 'self' cdn.jsdelivr.net"
          }
        ]
      }
    ];
  },
};

module.exports = nextConfig;