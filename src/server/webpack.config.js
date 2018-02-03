var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeExternals = require('webpack-node-externals');

//var tsLoader = require('awesome-typescript-loader');

module.exports = {
  entry: path.join(__dirname, 'server.ts'),
  target: 'node',
  node: {
    __dirname: false
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader',
    }]
  },
  resolve: {
    extensions: ['.ts', '.tsx', 'js'],
    //plugins: [new tsLoader.TsConfigPathsPlugin()]
  },
  output: {
    path: path.join(process.cwd(), '../../../'),
    filename: 'server.js'
  },
  externals: [
    nodeExternals({
      modulesDir: '../../'
    })
  ]
}