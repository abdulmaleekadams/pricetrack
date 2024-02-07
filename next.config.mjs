/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'm.media-amazon.com', protocol: 'https', pathname: '**' },
    ],
  },
};

export default nextConfig;
