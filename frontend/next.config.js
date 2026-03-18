/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic React configuration
  reactStrictMode: true,
  swcMinify: true,
  
  // Transpile blockchain packages
  transpilePackages: ['ethers'],
  
  // Webpack configuration for blockchain libraries
  webpack: (config, { isServer }) => {
    // Only apply polyfills on client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser'),
      };
      
      // Import webpack at the top to avoid runtime issues
      const webpack = require('webpack');
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );
    }
    
    return config;
  },
};

module.exports = nextConfig;
