const webpack = require('webpack')
const base = require('./webpack.base.js')
const config = require('./config')
const tsImportPluginFactory = require('ts-import-plugin')
const autoprefixer = require('autoprefixer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const env = process.env.REACT_APP_ENV
const isProd = process.env.REACT_APP_ENV === 'prod'

base.mode = 'development'
base.output = {
  filename: '[name].[hash:8].js',
  path: config.appBuild
}
base.module = {
  rules: [
    {
      test: /\.(js|jsx|mjs)$/,
      loader: require.resolve('source-map-loader'),
      enforce: 'pre',
      include: config.appSrc,
    },
    {
      oneOf: [
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: '[name].[hash:8].[ext]',
          },
        },
        {
          test: /\.(js|jsx|mjs)$/,
          include: config.appSrc,
          loader: require.resolve('babel-loader'),
          options: {
            compact: true,
          },
        },
        {
          test: /\.(ts|tsx)$/,
          include: config.appSrc,
          use: [
            {
              loader: require.resolve('ts-loader'),
              options: {
                transpileOnly: true,
                getCustomTransformers: () => ({
                  before: [tsImportPluginFactory(
                    {
                      libraryDirectory: 'es',
                      libraryName: 'antd',
                      style: true,
                    }
                  )]
                }),
                configFile: config.appTsProdConfig,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                url: true
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                // Necessary for external CSS imports to work
                // https://github.com/facebookincubator/create-react-app/issues/2677
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            }
          ]
        },
        {
          test: /\.less$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                url: true
              },
            },
            {
              loader: require.resolve('less-loader'),
              options: {
                modifyVars: {
                  'primary-color': 'deeppink',
                  'link-color': 'deeppink'
                },
                javascriptEnabled: true,
              }
            }
          ],
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : require.resolve('style-loader'),
            {
              loader: require.resolve('typings-for-css-modules-loader'),
              options: {
                modules: true,
                namedExport: true,
                camelCase: true,
                minimize: true,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
            {
              loader: require.resolve('sass-loader')
            }
          ],
        },
        {
          loader: require.resolve('file-loader'),
          exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/]
        }
      ]
    }
  ]
}
base.plugins.push(
  new webpack.DefinePlugin({
    'process.env.REACT_APP_ENV': JSON.stringify(env)
  }),
  new HtmlWebpackPlugin({
    inject: true,
    template: config.appHtml,
    favicon: config.appIcon,
    minify: {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true
    }
  })
)
if (isProd) {
  base.plugins.push(
    new MiniCssExtractPlugin(),
    new OptimizeCSSAssetsPlugin({})
  )
}
module.exports = base