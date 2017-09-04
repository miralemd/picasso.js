import DisplayObject from './display-object';
import {
  getRectVertices,
  getMinMax
} from '../../math/intersection';

/**
 * Calculates the bounding rectangle of a text node.
 * The bounding rectangle is a approximate of the "em square" seen here (http://www.w3resource.com/html5-canvas/html5-canvas-text.php)
 * @param {object} attrs - Text node definition
 * @param {number} attrs.x - X-coordinate
 * @param {number} attrs.y - Y-coordinate
 * @param {number} attrs.dx - Delta x-coordinate
 * @param {number} attrs.dy - Delta y-coordinate
 * @param {string} attrs.anchor - Text anchor
 * @param {number} attrs.maxWidth - Maximum allowed text width
 * @param {number} width - Measured text width
 * @param {number} height - Measured text height
 * @return {object} The bounding rectangle
 */
export function calcTextBounds(attrs, width, height) {
  const calWidth = Math.min(attrs.maxWidth || width, width); // Use actual value if max is not set
  const dx = attrs.dx || 0;
  const dy = attrs.dy || 0;

  const boundingRect = {
    x: 0,
    y: (attrs.y + dy) - (height * 0.75), // Magic number for ideographic baseline
    width: calWidth,
    height
  };

  const anchor = attrs['text-anchor'] || attrs.anchor;

  if (anchor === 'middle') {
    boundingRect.x = (attrs.x + dx) - (calWidth / 2);
  } else if (anchor === 'end') {
    boundingRect.x = (attrs.x + dx) - calWidth;
  } else {
    boundingRect.x = attrs.x + dx;
  }

  return boundingRect;
}

export default class Text extends DisplayObject {
  constructor(...s) {
    super('text');
    this.set(...s);
  }

  set(v = {}) {
    const {
      x = 0,
      y = 0,
      dx = 0,
      dy = 0,
      width = 0,
      height = 0,
      text,
      collider,
      boundingRect
    } = v;

    super.set(v);
    super.collider(collider);
    this.attrs.x = x;
    this.attrs.y = y;
    this.attrs.dx = dx;
    this.attrs.dy = dy;
    this.attrs.text = text;
    this._boundingRect = boundingRect || calcTextBounds(this.attrs, width, height);
  }

  boundingRect(includeTransform = false) {
    if (!this._boundingRect) {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    }

    const p = getRectVertices(this._boundingRect);
    const pt = includeTransform && this.modelViewMatrix ? this.modelViewMatrix.transformPoints(p) : p;
    const [xMin, yMin, xMax, yMax] = getMinMax(pt);

    return {
      x: xMin,
      y: yMin,
      width: xMax - xMin,
      height: yMax - yMin
    };
  }

  bounds(includeTransform = false) {
    const rect = this.boundingRect(includeTransform);

    return [
      { x: rect.x, y: rect.y },
      { x: rect.x + rect.width, y: rect.y },
      { x: rect.x + rect.width, y: rect.y + rect.height },
      { x: rect.x, y: rect.y + rect.height }
    ];
  }
}

export function create(...s) {
  return new Text(...s);
}
