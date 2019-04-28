const path = require('path')
const config = require('./config.js')

module.exports = {
  target: 'electron-renderer',
  entry: config.appIndexJs,
  resolve: {
    extensions: [
      '.mjs',
      '.web.ts',
      '.ts',
      '.web.tsx',
      '.tsx',
      '.web.js',
      '.js',
      '.json',
      '.web.jsx',
      '.jsx',
    ],
    alias: {
      '@': path.resolve(__dirname, '..', 'src'),
      'web': path.resolve(__dirname, '..', 'src', 'web'),
      'elec': path.resolve(__dirname, '..', 'src', 'electron')
    }
  },
  module: {},
  plugins: [],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};
