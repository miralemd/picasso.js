import { isLineIntersectingLine, isPointOnLine, isLineSegmentIntersectingRect, isCircleIntersectingLineSegment } from '../math/intersection';

export default class GeoLine {
  constructor({ x1 = 0, y1 = 0, x2 = 0, y2 = 0, tolerance = 0 } = {}) {
    this.set({ x1, y1, x2, y2, tolerance });
  }

  set({ x1 = 0, y1 = 0, x2 = 0, y2 = 0, tolerance = 0 } = {}) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.tolerance = Math.max(0, Math.round(tolerance));

    this.vectors = this.points();
    this.zeroSize = x1 === x2 && y1 === y2;
  }

  containsPoint(p) {
    if (this.zeroSize) {
      return false;
    }
    if (this.tolerance > 0) {
      const c = { cx: p.x, cy: p.y, r: this.tolerance };
      return this.intersectsCircle(c);
    }
    return isPointOnLine(this.vectors[0], this.vectors[1], p);
  }

  intersectsLine(points) {
    if (this.zeroSize) {
      return false;
    }
    return isLineIntersectingLine(this.vectors[0], this.vectors[1], points[0], points[1]);
  }

  intersectsRect(vertices) {
    if (this.zeroSize) {
      return false;
    }
    return isLineSegmentIntersectingRect(this.vectors, vertices);
  }

  intersectsCircle(c) {
    if (this.zeroSize) {
      return false;
    }
    return isCircleIntersectingLineSegment(c, this.vectors);
  }

  points() {
    return [
      { x: this.x1, y: this.y1 },
      { x: this.x2, y: this.y2 }
    ];
  }
}

export function create(...args) {
  return new GeoLine(...args);
}
