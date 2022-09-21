const MiniProgramTailwindWebpackPlugin = require('@dcasia/mini-program-tailwind-webpack-plugin')

module.exports = {
  transpileDependencies: ['luch-request'],
  configureWebpack: {
    plugins: [
      new MiniProgramTailwindWebpackPlugin({
        designWidth: 375,
      }),
    ],
  },
}
