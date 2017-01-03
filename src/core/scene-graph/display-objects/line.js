import DisplayObject from './display-object';
import GeoLine from '../../geometry/line';

export default class Line extends DisplayObject {
  constructor(...s) {
    super('line');
    this.geoLine = new GeoLine();
    this.set(...s);
  }

  set({ x1, y1, x2, y2, strokeWidth, stroke, opacity, transform }) {
    super.set({ strokeWidth, stroke, opacity, transform });
    this.attrs.x1 = x1;
    this.attrs.y1 = y1;
    this.attrs.x2 = x2;
    this.attrs.y2 = y2;
    this.geoLine.set(x1, y1, x2, y2);
  }
}

export function create(...s) {
  return new Line(...s);
}
