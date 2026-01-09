/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["next-mdx-remote"],
  experimental: {
    viewTransition: true,
  },

  async headers() {
    return [
      {
        // Apply to all routes
        source: "/:path*",
        headers: [
          // Prevent MIME sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },

          // Limit referrer leakage while keeping analytics usable
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          // Clickjacking protection (modern browsers honor it; old ones used X-Frame-Options)
          { key: "X-Frame-Options", value: "DENY" },

          // Don’t allow your origin to be treated as "trusted" for powerful features
          // Keep this conservative; you can loosen later if you add features like camera/mic/etc.
          {
            key: "Permissions-Policy",
            value: [
              "accelerometer=()",
              "autoplay=()",
              "camera=()",
              "cross-origin-isolated=()",
              "display-capture=()",
              "encrypted-media=()",
              "fullscreen=()",
              "geolocation=()",
              "gyroscope=()",
              "magnetometer=()",
              "microphone=()",
              "midi=()",
              "payment=()",
              "picture-in-picture=()",
              "publickey-credentials-get=()",
              "screen-wake-lock=()",
              "usb=()",
              "web-share=()",
              "xr-spatial-tracking=()",
            ].join(", "),
          },

          // Basic XSS protection header (largely legacy, but harmless)
          // Note: modern browsers ignore this; CSP is the real tool, which we're skipping.
          { key: "X-XSS-Protection", value: "0" },
        ],
      },
    ];
  },
};

export default nextConfig;
