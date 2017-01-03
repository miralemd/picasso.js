import DisplayObject from './display-object';
import GeoRect from '../../geometry/rect';

export default class Rect extends DisplayObject {
  constructor(...s) {
    super('rect');
    this.geoRect = new GeoRect();
    this.set(...s);
  }

  set(v) {
    const { x, y, width, height } = v;
    super.set(v);
    this.attrs.x = x;
    this.attrs.y = y;
    this.attrs.width = width;
    this.attrs.height = height;
    this.geoRect.set(x, y, width, height);
  }

  isPointInside(p) {
    let pt = this.modelViewMatrix ? this.inverseModelViewMatrix.transformPoint(p) : p;
    return this.geoRect.isPointInside(pt);
  }

  isLineIntersecting(points) {
    const pts = this.modelViewMatrix ? this.inverseModelViewMatrix.transformPoints(points) : points;
    return this.geoRect.isLineIntersecting(pts);
  }

  isRectIntersecting(points) {
    const pts = this.modelViewMatrix ? this.inverseModelViewMatrix.transformPoints(points) : points;
    return this.geoRect.isRectIntersecting(pts);
  }
}

export function create(...s) {
  return new Rect(...s);
}
