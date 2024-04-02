const isDev = process.env.NODE_ENV === 'development';
const basePath = isDev ? '' : '/labirinto-robo-html';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: isDev ? undefined : basePath,
  assetPrefix: isDev ? undefined : `${basePath}/`,
  env: {
    BASE_PATH: basePath
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
      fs: false,
      child_process: false,
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      'pouchdb-promise$': "pouchdb-promise/lib/index.js",
    }

    return config;
  }
}

module.exports = nextConfig;