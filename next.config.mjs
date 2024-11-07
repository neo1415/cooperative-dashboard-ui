/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.pexels.com" },
      { hostname: "res.cloudinary.com" }, // Add this line
    ],
  },
  experimental: {
    esmExternals: 'loose',
    forceSwcTransforms: true, // Force SWC transformations
  },
  typescript: {
    ignoreBuildErrors: true, // Disables TypeScript errors in production builds
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint warnings and errors during production builds
  },
};

export default nextConfig;
