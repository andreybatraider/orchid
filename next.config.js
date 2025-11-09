/** @type {import('next').NextConfig} */
const nextConfig = {
  // Отключаем ESLint во время сборки для упрощения
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Отключаем проверку типов во время сборки (можно включить позже)
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
