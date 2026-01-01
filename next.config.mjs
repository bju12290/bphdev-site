/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 16 uses Turbopack by default; next-mdx-remote often needs transpilation
  transpilePackages: ["next-mdx-remote"],
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
