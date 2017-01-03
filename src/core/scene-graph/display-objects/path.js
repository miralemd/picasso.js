import DisplayObject from './display-object';

export default class Path extends DisplayObject {
  constructor(...s) {
    super('path');
    this.set(...s);
  }

  set(v) {
    super.set(v);
    this.d = v.d;
  }
}

export function create(...s) {
  return new Path(...s);
}
