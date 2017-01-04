import { sqrDistance } from '../math/vector';
import { closestPointToLine, isPointOnLine } from '../math/intersection';

export default class GeoCircle {
  constructor(cx = 0, cy = 0, r = 0, minRadius = 0) {
    this.set(cx, cy, r, minRadius);
  }

  set(cx = 0, cy = 0, r = 0, minRadius = 0) {
    this.cx = cx;
    this.cy = cy;
    this.r = Math.max(r, minRadius);
    this.vector = { x: this.cx, y: this.cy };
  }

  containsPoint(p) {
    const sqrDist = sqrDistance(this.vector, p);
    if (sqrDist <= Math.pow(this.r, 2)) {
      return true;
    }
    return false;
  }

  intersectsLine(points) {
    const [p1, p2] = points;
    if (this.containsPoint(p1) || this.containsPoint(p2)) return true;

    const pointOnLine = closestPointToLine(p1, p2, this.vector);
    const dist = sqrDistance(pointOnLine, this.vector);

    return dist <= Math.pow(this.r, 2) && isPointOnLine(p1, p2, pointOnLine);
  }

  intersectsRect(points) {
    if (this.cy < points[0].y - this.r || this.cy > points[2].y + this.r) return false;
    if (this.cx < points[0].x - this.r || this.cx > points[2].x + this.r) return false;

    const vBoundary = this.cy >= points[0].y && this.cy <= points[2].y;
    const hBoundary = this.cx >= points[0].x && this.cx <= points[2].x;

    return (vBoundary && hBoundary) || this.intersectsLine([points[0], points[1]]) ||
      this.intersectsLine([points[1], points[2]]) ||
      this.intersectsLine([points[2], points[3]]) ||
      this.intersectsLine([points[3], points[0]]);
  }
}

export function create(...args) {
  return new GeoCircle(...args);
}
