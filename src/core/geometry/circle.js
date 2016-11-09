export default class Circle {
  constructor(cx = 0, cy = 0, r = 0) {
    this.set(cx, cy, r);
  }

  set(cx, cy, r) {
    this.cx = cx;
    this.cy = cy;
    this.r = r;
  }
}
