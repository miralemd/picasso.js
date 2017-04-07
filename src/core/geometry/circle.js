import { sqrDistance } from '../math/vector';
import { isCircleIntersectingRect, isCircleIntersectingLineSegment } from '../math/intersection';

export default class GeoCircle {
  constructor({ cx = 0, cy = 0, r = 0, minRadius = 0 } = {}) {
    this.set({ cx, cy, r, minRadius });
  }

  set({ cx = 0, cy = 0, r = 0, minRadius = 0 } = {}) {
    this.cx = cx;
    this.cy = cy;
    this.r = Math.max(r, minRadius);
    this.vector = { x: this.cx, y: this.cy };
    this.zeroSize = r <= 0;
  }

  containsPoint(p) {
    if (this.zeroSize) { return false; }

    const sqrDist = sqrDistance(this.vector, p);

    if (sqrDist <= Math.pow(this.r, 2)) {
      return true;
    }
    return false;
  }

  intersectsLine(points) {
    if (this.zeroSize) { return false; }

    return isCircleIntersectingLineSegment(this, points);
  }

  intersectsRect(points) {
    if (this.zeroSize) { return false; }
    const width = points[2].x - points[0].x;
    const height = points[2].y - points[0].y;
    const centerX = points[0].x + (width / 2);
    const centerY = points[0].y + (height / 2);

    return isCircleIntersectingRect(this.cx, this.cy, this.r, centerX, centerY, width, height);
  }

  intersectsCircle(c) {
    if (this.zeroSize || c.r <= 0) { return false; }

    const dx = this.cx - c.cx;
    const dy = this.cy - c.cy;
    const sqrDist = Math.pow(dx, 2) + Math.pow(dy, 2);

    if (sqrDist <= Math.pow(this.r + c.r, 2)) {
      return true;
    }
    return false;
  }

  /**
   * Currently not support
   * @return {boolean} FALSE
   */
  intersectsPolygon() { // eslint-disable-line
    return false;
  }

  points() {
    return [
      {
        x: this.cx,
        y: this.cy
      }
    ];
  }
}

export function create(...args) {
  return new GeoCircle(...args);
}
