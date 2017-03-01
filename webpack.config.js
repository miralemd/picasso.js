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
    mainFields: ['jsnext:main', 'main']
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: [
        path.resolve(__dirname, 'src'),
        /node_modules\/|\\d3-/
      ],
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['es2015'] // Re-verted back to this conf due to issues in Edge (SUI-507)
          // presets: [['es2015', { modules: false }]] // need to have this here instead of in .babelrc until after-work bumps babel dependecy to ^6.0.0
        }
      }
    }]
  }
};
