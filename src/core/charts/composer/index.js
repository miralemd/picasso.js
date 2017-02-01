import extend from 'extend';

import buildData from '../../data/index';
import buildFormatters, { getOrCreateFormatter } from './formatter';
import buildScales, { getOrCreateScale } from './scales';
import brush from '../../brush';
import buildScroll, { getScrollApi } from './scroll-api';

import getComponentFactory from '../../chart-components/index';

export default function composer() {
  let currentScales = null; // Built scales
  let currentFormatters = null; // Built formatters
  let currentScrollApis = null; // Build scroll apis

  let dataset = [];
  let brushes = {};

  const fn = function fn() {};

  fn.set = function set(data, settings, { partialData } = {}) {
    const {
      formatters = {},
      scales = {},
      scroll = {}
    } = settings;

    dataset = buildData(data);
    if (!partialData) {
      brushes = {};
    }
    currentScales = buildScales(scales, fn);
    currentFormatters = buildFormatters(formatters, fn);
    currentScrollApis = buildScroll(scroll, fn, currentScrollApis, partialData);
  };

  fn.dataset = function datasetFn() {
    return dataset;
  };

  fn.scales = function scales() {
    return currentScales;
  };

  fn.formatters = function formatters() {
    return currentFormatters;
  };

  fn.brush = function brushFn(name = 'default') {
    if (!brushes[name]) {
      brushes[name] = brush();
    }
    return brushes[name];
  };

  fn.scroll = function scrollFn(name = 'default') {
    return getScrollApi(name, currentScrollApis);
  };

  fn.scale = function scale(v) {
    return getOrCreateScale(v, currentScales, dataset);
  };

  fn.formatter = function formatter(v) {
    return getOrCreateFormatter(v, currentFormatters, fn.dataset());
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

  fn.stopBrushing = false;

  return fn;
}
