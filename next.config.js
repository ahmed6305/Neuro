/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    // Disable strict mode if causing double-renders in dev, but good for production
    reactStrictMode: true,
}

module.exports = nextConfig
