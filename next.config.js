/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  // Disable static optimization for pages that use API calls
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Ensure all pages are server-rendered, not statically generated
  trailingSlash: false,
};

module.exports = nextConfig;
