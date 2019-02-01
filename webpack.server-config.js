const webpack = require('webpack')
const path = require('path')

module.exports = {
  target: 'node',
  entry: ['./server/server.js', './node_modules/webpack/hot/poll?1000'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.bundle.js',
    libraryTarget: 'commonjs',
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  externals: [/^[a-z]/],
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: 'source-map',
}
