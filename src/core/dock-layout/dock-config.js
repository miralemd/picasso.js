import extend from 'extend';

export default function dockConfig({
  dock = '',
  displayOrder = 0,
  prioOrder = 0,
  relevantSizeFn = () => 0,
  minimumLayoutMode
} = {}) {
  const fn = function () {};
  const egdeBleed = { left: 0, right: 0, top: 0, bottom: 0 };

  fn.requiredSize = function (calcFn) {
    if (typeof calcFn === 'function') {
      relevantSizeFn = calcFn;
      return this;
    }
    return relevantSizeFn;
  };

  fn.dock = function (d) {
    if (typeof d === 'undefined') {
      return dock;
    }
    dock = d;
    return this;
  };

  fn.displayOrder = function (o) {
    if (typeof o === 'undefined') {
      return displayOrder;
    }
    displayOrder = o;
    return this;
  };

  fn.prioOrder = function (o) {
    if (typeof o === 'undefined') {
      return prioOrder;
    }
    prioOrder = o;
    return this;
  };

  fn.edgeBleed = function (b) {
    if (typeof b === 'undefined') {
      return egdeBleed;
    }
    extend(egdeBleed, b);
    return this;
  };

  fn.minimumLayoutMode = function (s) {
    if (typeof s === 'undefined') {
      return minimumLayoutMode;
    }
    minimumLayoutMode = s;
    return this;
  };

  return fn;
}
