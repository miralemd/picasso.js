export default class Line {
  constructor(x1 = 0, y1 = 0, x2 = 0, y2 = 0) {
    this.set(x1, y1, x2, y2);
  }

  set(x1 = 0, y1 = 0, x2 = 0, y2 = 0) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  points() {
    return [
      { x: this.x1, y: this.y1 },
      { x: this.x2, y: this.y2 }
    ];
  }
}
