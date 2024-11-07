/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [{ hostname: "images.pexels.com" }],
    },
    experimental: { esmExternals: 'loose' },
    typescript: {
      ignoreBuildErrors: true, // Disables TypeScript errors in production builds
    },
    eslint: {
      ignoreDuringBuilds: true, // Ignores ESLint warnings and errors during production builds
    },
  };
  
  export default nextConfig;
