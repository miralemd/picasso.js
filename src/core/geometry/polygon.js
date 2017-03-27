import {
  isLineIntersectingLine,
  getMinMax,
  rectContainsPoint,
  isCircleIntersectingLineSegment
} from '../math/intersection';

function close(vertices) {
  const first = vertices[0];
  const last = vertices[vertices.length - 1];

  if (first.x !== last.x || first.y !== last.y) {
    vertices.push(first);
  }
}

export default class GeoPolygon {
  /**
   * Construct a new GeoPolygon instance
   * @param {Object} input An object with a vertices property
   * @param {Object[]} [input.vertices=[]] Vertices are represented as an array of points.
   * @param {number} input.vertices[].x x-coordinate of vertice
   * @param {number} input.vertices[].y y-coordinate of vertice
   * @private
   */
  constructor({ vertices = [] } = {}) {
    this.set({ vertices });
  }

  /**
   * Set the vertices.
   * If vertices doesn't close the polygon, a closing vertice is appended.
   * @param {Object} input An object with a vertices property
   * @param {Object[]} [input.vertices=[]] Vertices are represented as an array of points.
   * @param {number} input.vertices[].x x-coordinate of vertice
   * @param {number} input.vertices[].y y-coordinate of vertice
   */
  set({ vertices = [] } = {}) {
    this.vertices = vertices.slice();
    this.edges = [];
    this._zeroSize = vertices.length < 2; // TODO check if all points are the same?

    if (this._zeroSize) { return; }

    close(this.vertices);

    for (let i = 0; i < this.vertices.length - 1; i++) {
      this.edges.push([this.vertices[i], this.vertices[i + 1]]);
    }

    this._minMax = null;
    this._bounds = null;
  }

  /**
   * Check if a Point is inside the area of the polygon.
   * Supports convex, concave and self-intersecting polygons (filled area).
   * @param {Object} point
   * @param {number} point.x
   * @param {number} point.y
   * @return {boolean} TRUE if Point is inside the polygon
   */
  containsPoint(point) {
    // TODO handle polygon that is a straight line, current impl gives a non-deterministic output, that is depending on number of vertices
    if (this._zeroSize || !rectContainsPoint(this.bounds(), point)) {
      return false;
    }

    let even = true;
    const num = this.vertices.length;
    this._minMax = this._minMax ? this._minMax : getMinMax(this.vertices);
    const [xMin] = this._minMax;
    const rayStart = { x: xMin - 1, y: point.y };

    for (let i = 0; i < num - 1; i++) {
      const v1 = this.vertices[i];
      const v2 = this.vertices[i + 1];
      if (!(v1.y < point.y && v2.y < point.y) && !(v1.y > point.y && v2.y > point.y)) { // filterout any edges that does not cross the ray
        even = isLineIntersectingLine(v1, v2, rayStart, point) ? !even : even;
      }
    }
    return !even;
  }

  /**
   * Check if Circle is inside the area of the polygon.
   * Supports convex, concave and self-intersecting polygons (filled area).
   * @param {Object} circle
   * @param {number} circle.cx center x-coordinate of the circle
   * @param {number} circle.cy center y-coordinate of the circle
   * @param {number} circle.r radius of the circle
   * @return {boolean} TRUE if Circle is intersecting the polygon
   */
  intersectsCircle(circle) {
    // TODO handle polygon that is a straight line, current impl will interrept it is a true, if radius is extended onto any of the edges
    if (this._zeroSize || circle.r <= 0) { return false; }

    if (this.containsPoint({ x: circle.cx, y: circle.cy })) { return true; }

    const num = this.edges.length;
    for (let i = 0; i < num; i++) {
      if (isCircleIntersectingLineSegment(circle, this.edges[i])) {
        return true;
      }
    }
    return false;
  }

  /**
   * Currently not support
   * @return {boolean} FALSE
   */
  intersectsLine() { // eslint-disable-line
    return false;
  }

  /**
   * Currently not support
   * @return {boolean} FALSE
   */
  intersectsRect() { // eslint-disable-line
    return false;
  }

  /**
   * Get the vertices
   * @return {Object[]} vertices
   */
  points() {
    return this.vertices;
  }

  /**
   * Get the bounds of the polygon, as an array of points
   * @return {Object[]} bounds
   */
  bounds() {
    if (!this._bounds) {
      this._minMax = this._minMax ? this._minMax : getMinMax(this.vertices);
      const [xMin, yMin, xMax, yMax] = this._minMax;

      this._bounds = [
        { x: xMin, y: yMin },
        { x: xMax, y: yMin },
        { x: xMax, y: yMax },
        { x: xMin, y: yMax }
      ];
    }

    return this._bounds;
  }
}


/**
* Construct a new GeoPolygon instance
* @param {Object} input An object with a vertices property
* @param {Object[]} [input.vertices=[]] Vertices are represented as an array of points.
* @param {number} input.vertices[].x x-coordinate of vertice
* @param {number} input.vertices[].y y-coordinate of vertice
* @private
*/
export function create(...a) {
  return new GeoPolygon(...a);
}
