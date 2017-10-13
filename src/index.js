import extend from 'extend';

import {
  chart,
  renderer,
  // temp
  dataset,
  // table,
  field
} from './core';

import './web';

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

import loggerFn from './core/utils/logger';
import registry from './core/utils/registry';

import { style, palettes } from './core/theme/pic';

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
  const logger = loggerFn(config.logger);
  const regis = {
    // -- registries --
    component: registry(registries.component),
    data: registry(registries.data),
    formatter: registry(registries.formatter),
    interaction: registry(registries.interaction),
    renderer: renderer(registries.renderer),
    scale: registry(registries.scale),
    symbol: registry(registries.symbol),
    // -- misc --
    logger,
    // -- temp -- // reconsider the data api when universal data is in place
    dataset,
    // table,
    field
  };

  if (config.renderer && config.renderer.prio) {
    regis.renderer.default(config.renderer.prio[0]);
  }

  /**
   * picasso.js
   *
   * @param {object} cfg
   * @returns {picasso}
   */
  function picassojs(cfg = {}) {
    let cc = extend({ palettes: [] }, config, cfg);
    cc.palettes = config.palettes.concat(cfg.palettes || []);
    return pic(cc, regis);
  }

  picassojs.use = (plugin, options = {}) => usePlugin(plugin, options, regis);
  picassojs.chart = definition => chart(definition, {
    registries: regis,
    logger,
    style: config.style,
    palettes: config.palettes
  });
  picassojs.config = () => config;

  Object.keys(regis).forEach((key) => {
    picassojs[key] = regis[key];
  });

  return picassojs;
}

const p = pic({
  renderer: {
    prio: ['svg', 'canvas']
  },
  logger: {
    level: 0
  },
  style,
  palettes
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

export {
  p as default
};
