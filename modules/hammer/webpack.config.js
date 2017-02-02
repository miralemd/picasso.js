'use strict'; // eslint-disable-line
/* eslint-env node*/

const path = require('path');

const srcDir = path.resolve(__dirname, 'src');

module.exports = {
  entry: {
    'picasso-hammer': path.resolve(srcDir, 'index')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: [/node_modules/],
      use: {
        loader: 'babel-loader',
        options: {
          presets: [['es2015', { modules: false }]]
        }
      }
    }]
  }
};
