const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'wrecktecnologia1.hospedagemdesites.ws',
        port: '', // Deixe vazio se não houver porta específica
        pathname: '/**', // Permite todas as rotas do domínio
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
});

module.exports = nextConfig;
