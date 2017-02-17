import Node from '../node';
import { create as geometry } from '../../geometry';
import Matrix from '../../math/matrix';
import resolveTransform from './../transform-resolver';
import nodeSelector from './../node-selector';
import createSceneObject from './../scene-object';
import { resolveCollionsOnNode, hasCollisionOnNode } from '../collision-resolver';

class DisplayObject extends Node {
  constructor(type) {
    super(type);
    this._stage = null;
    this._collider = null;
    this._attrs = {};
    this._node = null;
  }

  set(v = {}) {
    this.node = v;

    const {
      fill,
      stroke,
      strokeWidth,
      fontFamily,
      fontSize,
      baseline,
      anchor,
      maxWidth,
      opacity,
      transform,
      data
    } = v;

    const attrs = this.attrs;

    if (typeof fill !== 'undefined') {
      attrs.fill = fill;
    }
    if (typeof stroke !== 'undefined') {
      attrs.stroke = stroke;
    }
    if (typeof opacity !== 'undefined') {
      attrs.opacity = opacity;
    }
    if (typeof strokeWidth !== 'undefined') {
      attrs['stroke-width'] = strokeWidth;
    }
    if (typeof fontFamily !== 'undefined') {
      attrs['font-family'] = fontFamily;
    }
    if (typeof fontSize !== 'undefined') {
      attrs['font-size'] = fontSize;
    }
    if (typeof baseline !== 'undefined') {
      attrs['dominant-baseline'] = baseline;
    }
    if (typeof anchor !== 'undefined') {
      attrs['text-anchor'] = anchor;
    }
    if (typeof maxWidth !== 'undefined') {
      attrs.maxWidth = maxWidth;
    }
    if (typeof transform !== 'undefined') {
      attrs.transform = transform;
    }
    if (typeof data !== 'undefined') {
      this.data = data;
    }
  }

  collider(opts) {
    if (typeof opts === 'undefined') { return this._collider; }

    const { type = null } = opts;
    const c = { type };

    if (!type) {
      this._collider = null;
    } else if (type === 'frontChild') {
      this._collider = c;
    } else if (type === 'bounds') {
      const { x, y, width, height, minWidth, minHeight } = opts;
      c.fn = geometry('rect', x, y, width, height, minWidth, minHeight);
      this._collider = c;
    } else if (type === 'circle') {
      const { cx, cy, r, minRadius } = opts;
      c.fn = geometry(type, cx, cy, r, minRadius);
      this._collider = c;
    } else if (type === 'rect') {
      const { x, y, width, height, minWidth, minHeight } = opts;
      c.fn = geometry(type, x, y, width, height, minWidth, minHeight);
      this._collider = c;
    } else if (type === 'line') {
      const { x1, y1, x2, y2, tolerance } = opts;
      c.fn = geometry(type, x1, y1, x2, y2, tolerance);
      this._collider = c;
    }

    return this._collider;
  }

  findShapes(selector) {
    return nodeSelector.find(selector, this).map(node => createSceneObject(node));
  }

  getItemsFrom(shape) {
    return resolveCollionsOnNode(this, shape);
  }

  containsPoint(p) {
    return hasCollisionOnNode(this, p);
  }

  intersectsLine(line) {
    return hasCollisionOnNode(this, line);
  }

  intersectsRect(rect) {
    return hasCollisionOnNode(this, rect);
  }

  intersectsCircle(circle) {
    return hasCollisionOnNode(this, circle);
  }

  resolveLocalTransform(m = new Matrix()) {
    if (typeof this.attrs.transform !== 'undefined') { resolveTransform(this.attrs.transform, m); }
    this.modelViewMatrix = m.clone();
  }

  resolveGlobalTransform(m = new Matrix()) {
    const a = this.ancestors;

    if (a.length > 0) {
      for (let i = a.length - 1; i >= 0; i--) {
        a[i].resolveLocalTransform(m);
        m = a[i].modelViewMatrix;
      }
    }

    this.resolveLocalTransform(m);
  }

  /**
   * Returns the value of attribute a.
   * @param a
   * @returns {*} The value of attribute a.
   */
  attr(a) {
    return this.attrs[a];
  }

  equals(d) {
    const attrs = this.attrs;
    const attrKeys = Object.keys(attrs);
    const dAttrs = d.attrs;
    const dAttrKeys = Object.keys(dAttrs);
    if (attrKeys.length !== dAttrKeys.length) {
      return false;
    }
    for (let i = 0; i < attrKeys.length; i++) {
      const key = attrKeys[i];
      if (!Object.hasOwnProperty.call(dAttrs, key)) {
        return false;
      }
      if (attrs[key] !== dAttrs[key]) {
        return false;
      }
    }

    return super.equals(d);
  }

  toJSON() {
    const json = super.toJSON();
    json.attrs = this.attrs;
    return json;
  }

  get attrs() {
    return this._attrs;
  }

  get stage() {
    if (this._parent && !this._stage) { // lazy evaluation
      this._stage = this._parent.stage;
    } else if (!this._parent && this._stage !== this) {
      this._stage = null;
    }
    return this._stage;
  }

  set modelViewMatrix(m) {
    this._mvm = m;
    this._imvm = null;
  }

  get modelViewMatrix() {
    return this._mvm;
  }

  get inverseModelViewMatrix() {
    this._imvm = this._imvm ? this._imvm : this._mvm.clone().invert();
    return this._imvm;
  }

  set node(n) {
    this._node = n;
  }

  get node() {
    return this._node;
  }
}

export default DisplayObject;
