import DisplayObject from './display-object';
import {
  getRectVertices,
  getMinMax
} from '../../math/intersection';

export default class Text extends DisplayObject {
  constructor(...s) {
    super('text');
    this.set(...s);
  }

  set(v = {}) {
    const {
      x = 0,
      y = 0,
      dx = 0,
      dy = 0,
      textBoundsFn,
      text,
      collider,
      boundingRect
    } = v;

    super.set(v);
    super.collider(collider);
    this.attrs.x = x;
    this.attrs.y = y;
    this.attrs.dx = dx;
    this.attrs.dy = dy;
    this.attrs.text = text;
    if (boundingRect) {
      this._boundingRect = boundingRect;
    } else if (typeof textBoundsFn === 'function') {
      this._boundingRect = textBoundsFn(this.attrs);
    }
  }

  boundingRect(includeTransform = false) {
    if (!this._boundingRect) {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    }

    const p = getRectVertices(this._boundingRect);
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
  return new Text(...s);
}
