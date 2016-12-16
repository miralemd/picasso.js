import Node from '../node';

class DisplayObject extends Node {
  constructor(type) {
    super(type);
    this._stage = null;
    this._attrs = {};
  }

  set({ fill, stroke, strokeWidth, fontFamily, fontSize, baseline, anchor, maxWidth, opacity, transform }) {
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
}

export default DisplayObject;
