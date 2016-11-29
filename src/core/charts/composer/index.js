import { registry } from '../../utils/registry';
import { components } from '../../chart-components/index';
import { data } from '../../data/index';
import { dockLayout } from '../../dock-layout/dock-layout';
import {
  default as buildFormatters,
  getOrCreateFormatter
} from './formatter/index';
import {
  builder as buildScales,
  getOrCreateScale
} from './scales';

const regComps = registry();
regComps.add('components', components);

const regPreComps = registry();
regPreComps.add('scales', buildScales);
regPreComps.add('formatters', buildFormatters);


function getRect(container) {
  const rect = { x: 0, y: 0, width: 0, height: 0 };
  if (typeof container.getBoundingClientRect === 'function') {
    const boundingRect = container.getBoundingClientRect();
    rect.width = boundingRect.width;
    rect.height = boundingRect.height;
  } else {
    rect.width = container.width || 0;
    rect.height = container.height || 0;
  }

  return rect;
}

function flattenComponents(c) {
  const chartComponents = [];
  for (const prop in c) {
    if ({}.hasOwnProperty.call(c, prop)) {
      if (Array.isArray(c[prop])) {
        c[prop].forEach(cc => chartComponents.push(cc));
      } else {
        chartComponents.push(c[prop]);
      }
    }
  }
  return chartComponents;
}

export function composer() {
  let scales = {},
    formatters = {},
    tables = [],
    comps = {},
    container = null,
    docker = dockLayout();

  const fn = function () {};

  fn.build = function (element, meta, settings) {
    container = element;
    fn.data(meta, settings);
    fn.render();
  };

  fn.data = function (meta, settings) {
    tables = [data(meta)];
    const preComps = regPreComps.build(settings, fn);
    scales = preComps.scales;
    formatters = preComps.formatters;
    comps = regComps.build(settings, fn).components;
  };

  fn.table = function () {
    return tables[0];
  };

  fn.container = function () {
    return container;
  };

  fn.scale = function (v) {
    return getOrCreateScale(v, scales, tables);
  };

  fn.components = function () {
    return comps;
  };

  fn.render = function () {
    const cRect = getRect(container);
    const cc = flattenComponents(comps);

    cc.forEach((c) => { docker.addComponent(c); });

    docker.layout(cRect);

    cc.forEach((c) => { c.render(); });
  };

  fn.formatter = function (v) {
    return getOrCreateFormatter(v, formatters, fn.table());
  };

  return fn;
}
