import DisplayObject from './display-object';

export default class Text extends DisplayObject {
  constructor(...s) {
    super('text');
    this.set(...s);
  }

  set({ x, y, dx, dy, text, anchor, fontFamily, fontSize, fill, baseline, maxWidth, opacity, transform }) {
    super.set({ anchor, fontFamily, fontSize, fill, baseline, maxWidth, opacity, transform });
    this.attrs.x = x;
    this.attrs.y = y;
    this.attrs.dx = dx || 0;
    this.attrs.dy = dy || 0;
    this.attrs.text = text;
  }
}

export function create(...s) {
  return new Text(...s);
}
