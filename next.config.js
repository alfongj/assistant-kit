/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  redirects: async () => {
    return [
      {
        source: "/github",
        destination: "https://github.com/alfongj/assistant-kit",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
