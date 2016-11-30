import DisplayObject from './display-object';
import GeoCircle from '../../geometry/circle';

export default class Circle extends DisplayObject {
  constructor(...s) {
    super();
    this.set(...s);
  }

  set({ cx, cy, r, fill, stroke, strokeWidth, opacity, transform }) {
    super.set({ fill, stroke, strokeWidth, opacity, transform });
    GeoCircle.prototype.set.call(this, cx, cy, r);
  }

  isPointInside(p) {
    let pt = this.modelViewMatrix ? this.inverseModelViewMatrix.transformPoint(p) : p;
    return GeoCircle.prototype.isPointInside.call(this, pt);
  }
}

export function create(...s) {
  return new Circle(...s);
}
