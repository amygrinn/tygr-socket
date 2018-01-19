var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeExternals = require('webpack-node-externals');

/*
var nodeModules = {};
fs.readdirSync(path.join(__dirname, '../../../'))
  /*.filter(function (x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });
*/
module.exports = {
  entry: path.join(__dirname, 'server.ts'),
  target: 'node',
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader',
    }]
  },
  resolve: {
    extensions: ['.ts', '.tsx', 'js']
  },
  output: {
    path: path.join(process.cwd(), '../../../'),
    filename: 'server.js'
  },
  externals: [nodeExternals()]
}