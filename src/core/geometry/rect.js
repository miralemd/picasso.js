import { isLineIntersectingLine, isCircleIntersectingRect } from '../math/intersection';

export default class GeoRect {
  constructor(x = 0, y = 0, width = 0, height = 0, minWidth = 0, minHeight = 0) {
    this.set(x, y, width, height, minWidth, minHeight);
  }

  set(x = 0, y = 0, width = 0, height = 0, minWidth = 0, minHeight = 0) {
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

    this.vectors = this.points();
    this.zeroSize = this.width <= 0 || this.height <= 0;
    this.center = {
      x: this.x + (this.width / 2),
      y: this.y + (this.height / 2)
    };
  }

  containsPoint(p) {
    if (this.zeroSize) { return false; }

    return p.x >= this.x &&
      p.x <= this.x + this.width &&
      p.y >= this.y &&
      p.y <= this.y + this.height;
  }

  intersectsLine(points) {
    if (this.zeroSize) { return false; }
    if (this.containsPoint(points[0]) || this.containsPoint(points[1])) { return true; }

    for (let i = 0; i < 4; i++) {
      if (isLineIntersectingLine(this.vectors[i], this.vectors[i !== 3 ? i + 1 : 0], ...points)) { return true; }
    }
    return false;
  }

  intersectsRect(points) {
    if (this.zeroSize) { return false; }

    return this.x <= points[2].x && // this.left <= target.right
      points[0].x <= this.x + this.width && // target.left <= this.right
      this.y <= points[2].y && // this.top <= target.bottom
      points[0].y <= this.y + this.height; // target.top <= this.bottom
  }

  intersectsCircle(c) {
    if (this.zeroSize || c.r <= 0) { return false; }

    return isCircleIntersectingRect(c.x, c.y, c.r, this.center.x, this.center.y, this.width, this.height);
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
