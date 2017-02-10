import extend from 'extend';
import DisplayObject from './display-object';
import { getLineVectors, getMinMax } from '../../math/intersection';

export default class Line extends DisplayObject {
  constructor(...s) {
    super('line');
    this.set(...s);
  }

  set(v = {}) {
    const { x1 = 0, y1 = 0, x2 = 0, y2 = 0, collider } = v;
    super.set(v);
    this.attrs.x1 = x1;
    this.attrs.y1 = y1;
    this.attrs.x2 = x2;
    this.attrs.y2 = y2;

    const defaultCollider = {
      type: 'line',
      x1,
      y1,
      x2,
      y2
    };
    super.collider(extend(defaultCollider, collider));
  }

  boundingRect(includeTransform = false) {
    let p = getLineVectors(this.attrs);

    if (includeTransform && this.modelViewMatrix) {
      p = this.modelViewMatrix.transformPoints(p);
    }

    const [xMin, yMin, xMax, yMax] = getMinMax(p);

    return {
      x: xMin,
      y: yMin,
      width: xMax - xMin,
      height: yMax - yMin
    };
  }

  bounds(includeTransform = false) {
    const rect = this.boundingRect(includeTransform);
    return [
      { x: rect.x, y: rect.y },
      { x: rect.x + rect.width, y: rect.y },
      { x: rect.x + rect.width, y: rect.y + rect.height },
      { x: rect.x, y: rect.y + rect.height }
    ];
  }
}

export function create(...s) {
  return new Line(...s);
}
