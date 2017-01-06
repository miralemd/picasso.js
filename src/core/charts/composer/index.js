import extend from 'extend';

import buildData from '../../data/index';
import buildFormatters, { getOrCreateFormatter } from './formatter';
import buildScales, { getOrCreateScale } from './scales';
import brush from '../../brush';

import getComponentFactory from '../../chart-components/index';

export default function composer() {
  let currentScales = null; // Built scales
  let currentFormatters = null; // Built formatters

  let dataset = [];
  let brushes = {};

  const fn = function () {};

  fn.set = function (data, settings) {
    const {
      formatters = {},
      scales = {}
    } = settings;

    dataset = buildData(data);
    brushes = {};
    currentScales = buildScales(scales, fn);
    currentFormatters = buildFormatters(formatters, fn);
  };

  fn.table = function () {
    return dataset.tables()[0];
  };

  fn.dataset = function () {
    return dataset;
  };

  fn.scales = function () {
    return currentScales;
  };

  fn.formatters = function () {
    return currentFormatters;
  };

  fn.brush = function (name = 'default') {
    if (!brushes[name]) {
      brushes[name] = brush();
    }
    return brushes[name];
  };

  fn.scale = function (v) {
    return getOrCreateScale(v, currentScales, dataset);
  };

  fn.formatter = function (v) {
    return getOrCreateFormatter(v, currentFormatters, fn.table());
  };

  fn.createComponent = (settings, container) => {
    const factoryFn = getComponentFactory(settings.type);
    const instance = factoryFn(settings, fn, container);
    return {
      instance,
      settings: extend(true, {}, settings),
      key: settings.key,
      hasKey: typeof settings.key !== 'undefined'
    };
  };

  return fn;
}
