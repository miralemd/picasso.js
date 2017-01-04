import DisplayObject from './display-object';

export default class Line extends DisplayObject {
  constructor(...s) {
    super('line');
    this.set(...s);
  }

  set(v) {
    const { x1, y1, x2, y2 } = v;
    super.set(v);
    this.attrs.x1 = x1;
    this.attrs.y1 = y1;
    this.attrs.x2 = x2;
    this.attrs.y2 = y2;
  }
}

export function create(...s) {
  return new Line(...s);
}
