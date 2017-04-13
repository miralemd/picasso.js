import {
  getMinMax
} from '../math/intersection';
import NarrowPhaseCollision from '../math/narrow-phase-collision';

function close(vertices) {
  const first = vertices[0];
  const last = vertices[vertices.length - 1];

  if (first.x !== last.x || first.y !== last.y) {
    vertices.push(first);
  }
}

function removeDuplicates(vertices) {
  for (let i = 0; i < vertices.length - 1; i++) {
    const v0 = vertices[i];
    const v1 = vertices[i + 1];
    if (v0.x === v1.x && v0.y === v1.y) {
      vertices.splice(i, 1);
      i--;
    }
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

    removeDuplicates(this.vertices);

    if (this.vertices.length <= 2) {
      return;
    }

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
    return NarrowPhaseCollision.testPolygonPoint(this, point);
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
    return NarrowPhaseCollision.testCirclePolygon(circle, this);
  }

  intersectsLine(line) {
    return NarrowPhaseCollision.testPolygonLine(this, line);
  }

  intersectsRect(rect) {
    return NarrowPhaseCollision.testPolygonRect(this, rect);
  }

  /**
   * Currently not support
   * @return {boolean} FALSE
   */
  intersectsPolygon() { // eslint-disable-line
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
