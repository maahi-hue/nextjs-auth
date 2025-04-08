/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
      // Suppress warnings related to cosmiconfig, tsconfig-paths
      config.ignoreWarnings = [
        {
          module: /cosmiconfig/,
        },
        {
            module: /browserslist/,
        },
        {
          module: /tsconfig-paths/,
        },
      ];
  
      return config;
    },
  };
  
  export default nextConfig;
  