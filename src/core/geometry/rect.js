export default class Rect {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.set(x, y, width, height);
  }

  set(x = 0, y = 0, width = 0, height = 0) {
    if (width >= 0) {
      this.x = x;
      this.width = width;
    } else {
      this.x = x + width;
      this.width = -width;
    }
    if (height >= 0) {
      this.y = y;
      this.height = height;
    } else {
      this.y = y + height;
      this.height = -height;
    }
  }

  isPointInside(p) {
    let xBoundary = p.x >= this.x && p.x <= this.x + this.width;
    let yBoundary = p.y >= this.y && p.y <= this.y + this.height;
    if (xBoundary && yBoundary) {
      return true;
    }
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
