/**
 * Webpack config for production electron main process
 */

const path = require('path')
const webpack = require('webpack')
const paths = require('./config.js')
const env = process.env.REACT_APP_ENV

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  target: 'electron-main',
  entry: path.join(__dirname, '..', 'src', 'electron', 'index.ts'),
  output: {
    path: path.join(__dirname, '..'),
    filename: `./app/main.js`
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('file-loader'),
        options: {
          outputPath: './app',
          name: '[name].[ext]'
        },
      },
      {
        oneOf: [
          // Compile .tsx?
          {
            test: /\.(ts|tsx)$/,
            use: [
              {
                loader: require.resolve('ts-loader'),
                options: {
                  // disable type checker - we will use it in fork plugin
                  transpileOnly: true,
                  configFile: paths.appTsProdConfig,
                }
              }
            ]
          }
        ]
      }
    ]
  },
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
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.REACT_APP_ENV': JSON.stringify(env)
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      START_MINIMIZED: false
    })
  ],
  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false
  }
};
