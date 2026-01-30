/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",

  images: {
    unoptimized: true,
  },

  // Optional: keep this only if you really need it for local testing
  allowedDevOrigins: ["192.168.1.12"],
};

export default nextConfig;
