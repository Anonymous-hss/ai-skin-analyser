/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
  },
  // Increase the API body size limit to handle image uploads
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
}

module.exports = nextConfig

