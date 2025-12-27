import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',       // Destination for service worker files
  register: true,       // Register service worker automatically
  skipWaiting: true,    // Updates app immediately when new version is available
  disable: process.env.NODE_ENV === 'development', // Disable PWA in dev mode (optional, but recommended to avoid caching confusion)
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing config here...
};

export default withPWA(nextConfig);