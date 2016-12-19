import { registry } from '../../utils/registry';
import components from '../../chart-components/index';
import { data } from '../../data/index';
import dockLayout from '../../dock-layout/dock-layout';
import buildFormatters, { getOrCreateFormatter } from './formatter/index';
import {
  builder as buildScales,
  getOrCreateScale
} from './scales';

const regComps = registry();
regComps.add('components', components);

const regPreComps = registry();
regPreComps.add('scales', buildScales);
regPreComps.add('formatters', buildFormatters);

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

export default function composer() {
  let scales = {};
  let formatters = {};
  let dataset = [];
  let comps = {};
  let container = null;
  let docker = dockLayout();

  const fn = function () {};

  fn.build = function (element, meta, settings) {
    container = element;
    docker.settings(settings.dockLayout);
    fn.data(meta, settings);
    fn.render();
  };

  fn.data = function (meta, settings) {
    dataset = data(meta);
    const preComps = regPreComps.build(settings, fn);
    scales = preComps.scales;
    formatters = preComps.formatters;
    comps = regComps.build(settings, fn).components;
  };

  fn.table = function () {
    return dataset.tables()[0];
  };

  fn.dataset = function () {
    return dataset;
  };

  fn.container = function () {
    return container;
  };

  fn.scale = function (v) {
    return getOrCreateScale(v, scales, dataset);
  };

  fn.components = function () {
    return comps;
  };

  fn.render = function () {
    const cc = flattenComponents(comps);

    cc.forEach((c) => { docker.addComponent(c); });

    const { visible, hidden } = docker.layout(container);
    visible.forEach((c) => { c.render(); });
    hidden.forEach((c) => { if (c.hide) { c.hide(); } });
  };

  fn.formatter = function (v) {
    return getOrCreateFormatter(v, formatters, fn.table());
  };

  return fn;
}
