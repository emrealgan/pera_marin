/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    remotePatterns:[{
      protocol: 'http',
      hostname: 'peramarin.com'
    }]
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|mov)$/,
      use: {
        loader: "file-loader",
        options: {
          publicPath: "/",
          outputPath: "/",
          name: "[name].[hash].[ext]",
          esModule: false,
        },
      },
    });

    return config;
  },
};

export default nextConfig;
