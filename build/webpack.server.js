const webpack = require('webpack')
const dev = require('./webpack.dev.js')
const config = require('./config')

dev.devtool = 'eval-source-map'
dev.plugins.push(
  new webpack.HotModuleReplacementPlugin()
)
dev.devServer = {
  port: config.port,
  compress: true,
  contentBase: config.appBuild,
  historyApiFallback: true,
  hot: true
}
module.exports = dev