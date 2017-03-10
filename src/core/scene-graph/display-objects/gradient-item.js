import DisplayObject from './display-object';
import NodeContainer from '../node-container';

const NC = NodeContainer.prototype;

const allowedAttrs = [
  'x1',
  'x2',
  'y1',
  'y2',
  'id',
  'offset',
  'style'
];

export default class GradientItem extends DisplayObject {
  constructor(s = {}) {
    const { type = 'container' } = s;
    super(type);
    this.set(s);
    this._boundingRect = {};
  }

  set(v = {}) {
    super.set(v);

    const attrs = this.attrs;

    let attrKey = '';

    for (let i = 0, len = allowedAttrs.length; i !== len; i++) {
      attrKey = allowedAttrs[i];

      if (v[attrKey]) {
        attrs[attrKey] = v[attrKey];
      }
    }
  }

  addChild(c) {
    const r = NC.addChild.call(this, c);

    return r;
  }

  addChildren(children) {
    const r = NC.addChildren.call(this, children);

    return r;
  }

  removeChild(c) {
    c._stage = null;
    let desc = c.descendants,
      num = desc ? desc.length : 0,
      i;
    // remove reference to stage from all descendants
    for (i = 0; i < num; i++) {
      desc[i]._stage = null;
    }

    NC.removeChild.call(this, c);

    return this;
  }

  removeChildren(children) {
    NC.removeChildren.call(this, children);

    return this;
  }
}

export function create(...s) {
  return new GradientItem(...s);
}
