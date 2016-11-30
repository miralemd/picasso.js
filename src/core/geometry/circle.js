export default class Circle {
  constructor(cx = 0, cy = 0, r = 0) {
    this.set(cx, cy, r);
  }

  set(cx, cy, r) {
    this.cx = cx;
    this.cy = cy;
    this.r = r;
  }

  isPointInside(p) {
    let sqrDist = Math.pow(this.cx - p.x, 2) + Math.pow(this.cy - p.y, 2);
    if (sqrDist < Math.pow(this.r, 2)) {
      return true;
    }
    return false;
  }
}
