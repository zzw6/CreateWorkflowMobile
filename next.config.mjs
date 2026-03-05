/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/api/secondev/zwxwf',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
