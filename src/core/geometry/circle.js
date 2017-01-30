import { sqrDistance } from '../math/vector';
import { closestPointToLine, isPointOnLine, isCircleIntersectingRect } from '../math/intersection';

export default class GeoCircle {
  constructor(cx = 0, cy = 0, r = 0, minRadius = 0) {
    this.set(cx, cy, r, minRadius);
  }

  set(cx = 0, cy = 0, r = 0, minRadius = 0) {
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

    const [p1, p2] = points;

    if (this.containsPoint(p1) || this.containsPoint(p2)) { return true; }

    const pointOnLine = closestPointToLine(p1, p2, this.vector);
    const dist = sqrDistance(pointOnLine, this.vector);

    return dist <= Math.pow(this.r, 2) && isPointOnLine(p1, p2, pointOnLine);
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

    const dx = this.cx - c.x;
    const dy = this.cy - c.y;
    const sqrDist = Math.pow(dx, 2) + Math.pow(dy, 2);

    if (sqrDist <= Math.pow(this.r + c.r, 2)) {
      return true;
    }
    return false;
  }
}

export function create(...args) {
  return new GeoCircle(...args);
}
