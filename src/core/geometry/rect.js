import {
  pointsToLine,
  pointsToRect
} from '../math/intersection';
import NarrowPhaseCollision from '../math/narrow-phase-collision';

export default class GeoRect {
  constructor({ x = 0, y = 0, width = 0, height = 0, minWidth = 0, minHeight = 0 } = {}) {
    this.set({ x, y, width, height, minWidth, minHeight });
  }

  set({ x = 0, y = 0, width = 0, height = 0, minWidth = 0, minHeight = 0 } = {}) {
    if (width >= 0) {
      this.x = x;
      this.width = Math.max(width, minWidth);
    } else {
      this.x = x + Math.min(width, -minWidth);
      this.width = -Math.min(width, -minWidth);
    }

    if (height >= 0) {
      this.y = y;
      this.height = Math.max(height, minHeight);
    } else {
      this.y = y + Math.min(height, -minHeight);
      this.height = -Math.min(height, -minHeight);
    }
  }

  containsPoint(p) {
    return NarrowPhaseCollision.testRectPoint(this, p);
  }

  intersectsLine(points) {
    const line = pointsToLine(points);
    return NarrowPhaseCollision.testRectLine(this, line);
  }

  intersectsRect(points) {
    const rect = pointsToRect(points);
    return NarrowPhaseCollision.testRectRect(this, rect);
  }

  intersectsCircle(c) {
    return NarrowPhaseCollision.testCircleRect(c, this);
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
      { x: this.x, y: this.y },
      { x: this.x + this.width, y: this.y },
      { x: this.x + this.width, y: this.y + this.height },
      { x: this.x, y: this.y + this.height }
    ];
  }
}

export function create(...args) {
  return new GeoRect(...args);
}
