import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The Hub is an internal tool — don't index it.
  async headers() {
    return [
      { source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
};

export default nextConfig;
