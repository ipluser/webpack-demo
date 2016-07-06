const webpack = require('webpack');

exports.devServer = function (options) {
  return {
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      stats: 'errors-only',
      host: options.host,
      port: options.port
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ]
  }
};

exports.setupCSS = function (paths) {
  return {
    module: {
      loaders: [{
        test: /\.css$/,
        loaders: ['style', 'css?sourceMap'],
        include: paths
      }]
    }
  }
}