import {
  chart,
  renderer,
  // temp
  dataset,
  table,
  field
} from './core';

import {
  components,
  scales,
  renderers
} from './api';

import componentRegistry from './core/component';
import dataRegistry from './core/data';
import formatterRegistry from './core/formatter';
import interactionRegistry from './core/interaction';
import scaleRegistry from './core/charts/scales';

import logger from './core/utils/logger';
import registry from './core/utils/registry';

function usePlugin(plugin, options = {}, api) {
  plugin(api, options);
}

/**
 * Create a custom configuration of picasso.js
 *
 * @param {object} cfg
 * @returns {picasso}
 */
function pic(config = {}, registries = {}) {
  /**
   * The registries provided to plugins
   */
  const regis = {
    component: registry(registries.component),
    data: registry(registries.data),
    formatter: registry(registries.formatter),
    interaction: registry(registries.interaction),
    renderer: renderer(registries.renderer),
    scale: registry(registries.scale),
    symbol: registry(registries.symbol),
    // temp
    dataset,
    table,
    field
  };

  /**
   * picasso.js
   *
   * @param {object} cfg
   * @returns {picasso}
   */
  function picassojs(cfg) {
    return pic({
      ...config,
      ...cfg
    }, regis);
  }

  const logme = logger(config.logger);

  picassojs.use = (plugin, options = {}) => usePlugin(plugin, options, regis);
  picassojs.chart = definition => chart(definition, {
    registries: regis,
    logger: logme
  });
  picassojs.config = () => config;

  Object.keys(regis).forEach((key) => {
    picassojs[key] = regis[key];
  });

  return picassojs;
}

const p = pic({
  renderer: {
    prio: ['canvas', 'svg']
  },
  logger: {
    level: 2
  }
}, {
  component: componentRegistry,
  data: dataRegistry,
  formatter: formatterRegistry,
  interaction: interactionRegistry,
  renderer: renderer(),
  scale: scaleRegistry
});

components.forEach(p.use);
renderers.forEach(p.use);
scales.forEach(p.use);

p.renderer.default('svg');

export {
  p as default
};
