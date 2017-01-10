import extend from 'extend';
import DisplayObject from './display-object';
import { convertRectToPoints, getMinMax } from '../../math/intersection';

export default class Rect extends DisplayObject {
  constructor(...s) {
    super('rect');
    this.set(...s);
  }

  set(v = {}) {
    const { x = 0, y = 0, width = 0, height = 0, collider } = v;
    const opts = extend({ type: 'rect', x, y, width, height }, collider);

    super.set(v);
    super.collider(opts);

    if (width >= 0) {
      this.attrs.x = x;
      this.attrs.width = width;
    } else {
      this.attrs.x = x + width;
      this.attrs.width = -width;
    }

    if (height >= 0) {
      this.attrs.y = y;
      this.attrs.height = height;
    } else {
      this.attrs.y = y + height;
      this.attrs.height = -height;
    }
  }

  boundingRect(includeTransform = false) {
    const p = convertRectToPoints(this.attrs);
    const pt = includeTransform && this.modelViewMatrix ? this.modelViewMatrix.transformPoints(p) : p;
    const [xMin, yMin, xMax, yMax] = getMinMax(pt);

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
  return new Rect(...s);
}
