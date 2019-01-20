const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const package = require('./package.json');

module.exports = {
  entry: path.resolve(__dirname, 'src'),

  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: 'dist',
  },

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },

  module: {
    rules: [{ test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/ }],
  },

  plugins: [
    new CleanWebpackPlugin('dist'),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({ title: package.name }),
    new CopyWebpackPlugin([{ from: 'public' }]),
  ]
};
