import Container from './container';
import { scalarMultiply } from '../../math/vector';
import { convertLineToPoints, convertRectToPoints } from '../../math/intersection';

function traverseFn(objects, fn, ary, ...args) {
  for (let i = 0; i < objects.length; i++) {
    const o = objects[i];
    let m = false;

    if (o[fn] && o[fn](...args)) {
      ary.push(o);
      m = true;
    }

    if (o.children && !m) { // Only traverse children if no match is found on parent
      traverseFn(o.children, fn, ary, ...args);
    }
  }
}

export default class Stage extends Container {
  constructor(dpi) {
    super('stage');
    this._stage = this;
    this._dpiRatio = dpi || 1;
  }

  containsPoint(p) {
    const result = [];
    traverseFn(this.children, 'containsPoint', result, scalarMultiply(p, this._dpiRatio));
    return result;
  }

  intersectsLine(line) {
    const result = [];
    const points = convertLineToPoints(line).map(p => scalarMultiply(p, this._dpiRatio));
    traverseFn(this.children, 'intersectsLine', result, points);
    return result;
  }

  intersectsRect(rect) {
    const result = [];
    const points = convertRectToPoints(rect).map(p => scalarMultiply(p, this._dpiRatio));
    traverseFn(this.children, 'intersectsRect', result, points);
    return result;
  }
}

export function create(...a) {
  return new Stage(...a);
}
