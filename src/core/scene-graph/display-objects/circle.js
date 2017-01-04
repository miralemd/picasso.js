import extend from 'extend';
import DisplayObject from './display-object';

export default class Circle extends DisplayObject {
  constructor(...s) {
    super('circle');
    this.set(...s);
  }

  set(v) {
    const { cx, cy, r, collider } = v;
    super.set(v);
    super.collider(extend({ type: 'circle', cx, cy, r }, collider));
    this.attrs.cx = cx;
    this.attrs.cy = cy;
    this.attrs.r = r;
  }
}

export function create(...s) {
  return new Circle(...s);
}
