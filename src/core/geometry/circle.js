import { pointsToLine, pointsToRect } from '../math/intersection';
import NarrowPhaseCollision from '../math/narrow-phase-collision';

export default class GeoCircle {
  constructor({ cx = 0, cy = 0, r = 0, minRadius = 0 } = {}) {
    this.set({ cx, cy, r, minRadius });
  }

  set({ cx = 0, cy = 0, r = 0, minRadius = 0 } = {}) {
    this.cx = cx;
    this.cy = cy;
    this.r = Math.max(r, minRadius);
    this.vector = { x: this.cx, y: this.cy };
  }

  containsPoint(p) {
    return NarrowPhaseCollision.testCirclePoint(this, p);
  }

  intersectsLine(points) {
    const line = pointsToLine(points);

    return NarrowPhaseCollision.testCircleLine(this, line);
  }

  intersectsRect(points) {
    const rect = pointsToRect(points);

    return NarrowPhaseCollision.testCircleRect(this, rect);
  }

  intersectsCircle(c) {
    return NarrowPhaseCollision.testCircleCircle(this, c);
  }

  intersectsPolygon(polygon) {
    return NarrowPhaseCollision.testCirclePolygon(this, polygon);
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
