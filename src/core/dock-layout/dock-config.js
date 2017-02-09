export default function dockConfig(settings = {}) {
  let {
    dock = '',
    displayOrder = 0,
    prioOrder = 0,
    requiredSize = () => 0,
    minimumLayoutMode
  } = settings;

  const fn = function fn() {};

  fn.requiredSize = function requiredSizeFn(calcFn) {
    if (typeof calcFn === 'function') {
      requiredSize = calcFn;
      return this;
    }
    return requiredSize;
  };

  fn.dock = function dockFn(d) {
    if (typeof d === 'undefined') {
      return dock;
    }
    dock = d;
    return this;
  };

  fn.displayOrder = function displayOrderFn(o) {
    if (typeof o === 'undefined') {
      return displayOrder;
    }
    displayOrder = o;
    return this;
  };

  fn.prioOrder = function prioOrderFn(o) {
    if (typeof o === 'undefined') {
      return prioOrder;
    }
    prioOrder = o;
    return this;
  };

  fn.minimumLayoutMode = function minimumLayoutModeFn(s) {
    if (typeof s === 'undefined') {
      return minimumLayoutMode;
    }
    minimumLayoutMode = s;
    return this;
  };

  return fn;
}
