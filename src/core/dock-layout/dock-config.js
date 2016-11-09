export function dockConfig(dock = '', displayOrder = 0, prioOrder = 0, relevantSizeFn = () => 0) {
  const fn = function () {};

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

  return fn;
}
