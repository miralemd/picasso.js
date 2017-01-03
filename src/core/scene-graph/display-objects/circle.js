import DisplayObject from './display-object';
import GeoCircle from '../../geometry/circle';

export default class Circle extends DisplayObject {
  constructor(...s) {
    super('circle');
    this.geoCircle = new GeoCircle();
    this.set(...s);
  }

  set(v) {
    const { cx, cy, r } = v;
    super.set(v);
    this.attrs.cx = cx;
    this.attrs.cy = cy;
    this.attrs.r = r;
    this.geoCircle.set(cx, cy, r);
  }

  isPointInside(p) {
    const pt = this.modelViewMatrix ? this.inverseModelViewMatrix.transformPoint(p) : p;
    return this.geoCircle.isPointInside(pt);
  }

  isLineIntersecting(points) {
    const pts = this.modelViewMatrix ? this.inverseModelViewMatrix.transformPoints(points) : points;
    return this.geoCircle.isLineIntersecting(pts);
  }

  isRectIntersecting(points) {
    const pts = this.modelViewMatrix ? this.inverseModelViewMatrix.transformPoints(points) : points;
    return this.geoCircle.isRectIntersecting(pts);
  }
}

export function create(...s) {
  return new Circle(...s);
}
