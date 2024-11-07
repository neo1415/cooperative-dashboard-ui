/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [{ hostname: "images.pexels.com" }],
    },
    experimental: { esmExternals: 'loose' },
  };
  
  export default nextConfig;
