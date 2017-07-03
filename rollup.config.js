/* eslint-env-node */

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';

const isProduction = process.env.BUILD === 'production';

const config = {
  entry: 'src/index.js',
  dest: 'dist/picasso.js',
  moduleName: 'picasso',
  format: 'umd',
  sourceMap: !isProduction,
  plugins: [
    resolve({ jsnext: true, preferBuiltins: false }),
    babel({
      exclude: 'node_modules/**',
      presets: [['es2015', { modules: false }]],
      plugins: ['external-helpers', 'transform-object-rest-spread']
    }),
    commonjs(),
    filesize()
  ]
};

if (isProduction) {
  config.dest = config.dest.replace(/js$/, 'min.js');
  config.plugins.push(uglify());
}

export default config;
