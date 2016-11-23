import DisplayObject from './display-object';

export default class Text extends DisplayObject {
  constructor(...s) {
    super();
    this.set(...s);
  }

  set({ x, y, dx, dy, text, anchor, fontFamily, fontSize, fill, baseline, maxWidth, opacity, transform }) {
    super.set({ anchor, fontFamily, fontSize, fill, baseline, maxWidth, opacity, transform });
    this.x = x;
    this.y = y;
    this.dx = dx || 0;
    this.dy = dy || 0;
    this.text = text;
  }
}

export function create(...s) {
  return new Text(...s);
}
