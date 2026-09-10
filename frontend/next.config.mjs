/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        // Local `npm run dev` talks directly to the host backend. Docker supplies
        // API_URL=http://backend:8080 so the container continues using its service DNS.
        destination: `${process.env.API_URL || 'http://localhost:8080'}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
