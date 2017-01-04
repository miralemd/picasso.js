import extend from 'extend';
import DisplayObject from './display-object';

export default class Rect extends DisplayObject {
  constructor(...s) {
    super('rect');
    this.set(...s);
  }

  set(v) {
    const { x, y, width, height, collider } = v;
    super.set(v);
    super.collider(extend({ type: 'rect', x, y, width, height }, collider));

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
}

export function create(...s) {
  return new Rect(...s);
}
