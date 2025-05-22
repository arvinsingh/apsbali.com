/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...existing config...
  
  webpack: (config, { isServer }) => {
    // Only on the client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        encoding: false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;