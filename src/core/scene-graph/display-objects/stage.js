import Container from './container';

function traverseFn(objects, fn, ary, ...args) {
  objects.forEach((o) => {
    if (o.children) {
      traverseFn(o.children, fn, ary, ...args);
    }

    if (o[fn] && o[fn](...args)) {
      ary.push(o);
    }
  });
}

export default class Stage extends Container {
  constructor(dpi) {
    super('stage');
    this._stage = this;
    this._dpiRatio = dpi || 1;
  }

  pointInside(p) {
    const bounds = [];
    const pScaled = { x: p.x * this._dpiRatio, y: p.y * this._dpiRatio };
    traverseFn(this.children, 'isPointInside', bounds, pScaled);
    return bounds;
  }
}

export function create(...a) {
  return new Stage(...a);
}
