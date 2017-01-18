'use strict'; // eslint-disable-line
/* eslint-env node*/

const path = require('path');

const srcDir = path.resolve(__dirname, 'src');

module.exports = {
  entry: {
    picasso: path.resolve(srcDir, 'index')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd'
  },
  resolve: {
    packageMains: ['jsnext:main', 'main']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015'] // need to have this here instead of in .babelrc until after-work bumps babel dependecy to ^6.0.0
      },
      include: [
        path.resolve(__dirname, 'src'),
        /node_modules\/|\\d3-/
      ]
    }]
  }
};
