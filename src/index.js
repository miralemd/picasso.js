import {
  chart,
  renderer
} from './core';
import config from './config';
import './web';

/**
 * The mother of all namespaces
 * @namespace picasso
 */

const exports = {
  chart,
  renderer
};

Object.defineProperty(exports, 'Promise', {
  get: () => config.Promise,
  set: (p) => { config.Promise = p; }
});

module.exports = exports;
