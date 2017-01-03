import Container from './container';
import { scalarMultiply } from '../../math/vector';
import { convertLineToPoints, convertRectToPoints } from '../../math/intersection';

function traverseFn(objects, fn, ary, ...args) {
  for (let i = 0; i < objects.length; i++) {
    const o = objects[i];
    if (o.children) {
      traverseFn(o.children, fn, ary, ...args);
    }

    if (o[fn] && o[fn](...args)) {
      ary.push(o);
    }
  }
}

export default class Stage extends Container {
  constructor(dpi) {
    super('stage');
    this._stage = this;
    this._dpiRatio = dpi || 1;
  }

  pointInside(p) {
    const result = [];
    traverseFn(this.children, 'isPointInside', result, scalarMultiply(p, this._dpiRatio));
    return result;
  }

  lineIntersect(line) {
    const result = [];
    const points = convertLineToPoints(line).map(p => scalarMultiply(p, this._dpiRatio));
    traverseFn(this.children, 'isLineIntersecting', result, points);
    return result;
  }

  rectIntersect(rect) {
    const result = [];
    const points = convertRectToPoints(rect).map(p => scalarMultiply(p, this._dpiRatio));
    traverseFn(this.children, 'isRectIntersecting', result, points);
    return result;
  }
}

export function create(...a) {
  return new Stage(...a);
}
