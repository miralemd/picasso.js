import DisplayObject from './display-object';

export default class Path extends DisplayObject {
  constructor(...s) {
    super();
    this.set(...s);
  }

  set({ d, strokeWidth, stroke, opacity, transform }) {
    super.set({ strokeWidth, stroke, opacity, transform });
    this.d = d;
  }
}

export function create(...s) {
  return new Path(...s);
}
