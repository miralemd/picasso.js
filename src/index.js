import {
  chart,
  renderer,
  data,
  component
} from './core';
import q from './q';
import './web';

/**
 * The mother of all namespaces
 * @namespace picasso
 */

function use(plugin, options = {}) {
  plugin({
    chart,
    renderer,
    data,
    component,
    q
  }, options);
}

export {
  chart,
  renderer,
  data,
  use,
  component,
  q
};
