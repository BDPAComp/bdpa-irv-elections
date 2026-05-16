/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // BDPA logo is hosted at bdpa.org (Req 8)
    remotePatterns: [{ protocol: 'https', hostname: 'bdpa.org' }],
  },
};

module.exports = nextConfig;
