import { pointsToRect, pointsToCircle, pointsToLine } from '../math/intersection';

function pointsToPath(points) {
  let d = '';

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (i === 0) {
      d += `M${p.x} ${p.y}`;
    } else {
      d += `L${p.x} ${p.y}`;
    }

    d += ' ';
  }

  d += 'Z';

  return d;
}

function colliderToShape(node, dpi) {
  const collider = node.collider();

  if (collider && collider.fn) {
    const mvm = node.modelViewMatrix;
    const type = collider.type;
    let points = collider.fn.points();
    points = mvm ? mvm.transformPoints(points) : points;
    points.forEach((p) => {
      p.x /= dpi;
      p.y /= dpi;
    });

    if (type === 'rect' || type === 'bounds') {
      const rect = pointsToRect(points);
      rect.type = 'rect';
      return rect;
    } else if (type === 'circle') {
      const circle = pointsToCircle(points, collider.fn.r);
      circle.type = 'circle';
      return circle;
    } else if (type === 'line') {
      const line = pointsToLine(points);
      line.type = 'line';
      return line;
    } else if (type === 'polygon') {
      const path = pointsToPath(points);
      return {
        type: 'path',
        d: path
      };
    }
  }

  return null;
}

export class SceneObject {
  /**
   * Read-only object representing a node on the scene.
   */
  constructor(node) {
    this._bounds = node.boundingRect ? () => node.boundingRect(true) : () => ({ x: 0, y: 0, width: 0, height: 0 });
    this._attrs = node.attrs;
    this._type = node.type;
    this._data = node.data;
    this._dpi = node.stage ? node.stage.dpi : 1;
    this._collider = () => colliderToShape(node, this._dpi);
  }

  /**
   * Get the node type
   * @return {string} - Node type
   */
  get type() {
    return this._type;
  }

  /**
   * Get the associated data
   * @return {string|number|Object} - Data
   */
  get data() {
    return this._data;
  }

  /**
   * Get the node attributes
   * @return {Object} - Node attributes
   */
  get attrs() {
    return this._attrs;
  }

  /**
   * Get the element the scene is attached to
   * @return {HTMLElement} - Element the scene is attached to
   */
  get element() {
    return this._element;
  }

  /**
  * Set the element the scene is attached to
  * @param {HTMLElement} e - Element the scene is attached to
  */
  set element(e) {
    this._element = e;
  }

  /**
  * Get the key of the component this shape belong to.
  * @return {string} - Key
  */
  get key() {
    return this._key;
  }

  /**
  * Set the key of the component this shape belong to.
  * @param {string} k - Key
  */
  set key(k) {
    this._key = k;
  }

  /**
   * Get bounding rectangle of the node. After any transform has been applied, if any, but excluding scaling transform related to devicePixelRatio.
   * Origin is in the top-left corner of the scene element.
   * @return {Object} Bounding rectangle of the node.
   */
  get bounds() {
    const bounds = this._bounds();
    bounds.x /= this._dpi;
    bounds.y /= this._dpi;
    bounds.width /= this._dpi;
    bounds.height /= this._dpi;
    return bounds;
  }

  /**
   * Get collider of the node. Transform on the node has been applied to the collider shape, if any, but excluding scaling transform related to devicePixelRatio.
   * Origin is in the top-left corner of the scene element.
   * @return {Object} Shape of the collider.
   */
  get collider() {
    return this._collider();
  }
}

export default function create(...a) {
  return new SceneObject(...a);
}
