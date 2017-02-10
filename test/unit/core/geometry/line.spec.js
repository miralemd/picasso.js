import GeoLine from '../../../../src/core/geometry/line';

describe('GeoLine', () => {
  describe('constructor', () => {
    it('should set correct default values when no arguments passed', () => {
      const l = new GeoLine();

      expect(l.x1).to.equal(0);
      expect(l.y1).to.equal(0);
      expect(l.x2).to.equal(0);
      expect(l.y2).to.equal(0);
      expect(l.tolerance).to.equal(0);
    });

    it('should set the correct values when arguments passed', () => {
      const l = new GeoLine(1, 2, 3, 4, 5);

      expect(l.x1).to.equal(1);
      expect(l.y1).to.equal(2);
      expect(l.x2).to.equal(3);
      expect(l.y2).to.equal(4);
      expect(l.tolerance).to.equal(5);
    });
  });

  describe('set', () => {
    it('should set the correct values', () => {
      const l = new GeoLine();
      l.set(6, 7, 8, 9, 10);

      expect(l.x1).to.equal(6);
      expect(l.y1).to.equal(7);
      expect(l.x2).to.equal(8);
      expect(l.y2).to.equal(9);
      expect(l.tolerance).to.equal(10);
    });
  });

  describe('points', () => {
    it('should return the correct points', () => {
      const l = new GeoLine(5, 6, 7, 8),
        points = l.points();

      expect(points[0]).to.deep.equal({ x: 5, y: 6 });
      expect(points[1]).to.deep.equal({ x: 7, y: 8 });
    });
  });

  describe('Intersection', () => {
    describe('Point', () => {
      it('should intersect point on a horizontal line segment', () => {
        const line = new GeoLine(1, 3, 5, 3);
        const p = { x: 4, y: 3 };
        const start = { x: 1, y: 3 };
        const end = { x: 1, y: 3 };

        expect(line.containsPoint(p)).to.equal(true);
        expect(line.containsPoint(start)).to.equal(true);
        expect(line.containsPoint(end)).to.equal(true);
      });

      it('should intersect point on a vertical line segment', () => {
        const line = new GeoLine(3, 1, 3, 5);
        const p = { x: 3, y: 3 };
        const start = { x: 3, y: 1 };
        const end = { x: 3, y: 5 };

        expect(line.containsPoint(p)).to.equal(true);
        expect(line.containsPoint(start)).to.equal(true);
        expect(line.containsPoint(end)).to.equal(true);
      });

      it('should intersect point on a angled line segment', () => {
        const line = new GeoLine(-3, 0, 0, 3);
        const p = { x: -2, y: 1 };
        const start = { x: -3, y: 0 };
        const end = { x: 0, y: 3 };

        expect(line.containsPoint(p)).to.equal(true);
        expect(line.containsPoint(start)).to.equal(true);
        expect(line.containsPoint(end)).to.equal(true);
      });

      it('should not intersect point if outside vertical line segment', () => {
        const line = new GeoLine(3, 1, 3, 5);
        const p1 = { x: 3, y: 0 };
        const p2 = { x: 3, y: 6 };

        expect(line.containsPoint(p1)).to.equal(false);
        expect(line.containsPoint(p2)).to.equal(false);
      });

      it('should not intersect point if outside angled line segment', () => {
        const line = new GeoLine(-3, 0, 0, 3);
        const p1 = { x: 1, y: 4 };
        const p2 = { x: 4, y: -1 };

        expect(line.containsPoint(p1)).to.equal(false);
        expect(line.containsPoint(p2)).to.equal(false);
      });

      it('should intersect point with tolerance on line segment', () => {
        const line = new GeoLine(0, 0, 3, 3, 2);
        const p = { x: 4, y: 3 };
        const start = { x: -1, y: -1 };
        const end = { x: 4, y: 4 };

        expect(line.containsPoint(p)).to.equal(true);
        expect(line.containsPoint(start)).to.equal(true);
        expect(line.containsPoint(end)).to.equal(true);
      });

      it('should not intersect point if line segment has zero size', () => {
        const line = new GeoLine(1, 1, 1, 1);
        const p1 = { x: 4, y: 3 };
        const p2 = { x: 1, y: 1 };

        expect(line.containsPoint(p1)).to.equal(false);
        expect(line.containsPoint(p2)).to.equal(false);
      });
    });

    describe('Line', () => {
      it('should intersect perpendicular axis-aligned line segments', () => {
        const line = new GeoLine(4, 0, 4, 6); // y-axis aligned
        const line2 = [{ x: 1, y: 3 }, { x: 7, y: 3 }]; // x-axis aligned
        const atStart = [{ x: 0, y: 0 }, { x: 10, y: 0 }]; // x-axis aligned
        const atEnd = [{ x: 0, y: 6 }, { x: 10, y: 6 }]; // x-axis aligned

        expect(line.intersectsLine(line2)).to.equal(true);
        expect(line.intersectsLine(atStart)).to.equal(true);
        expect(line.intersectsLine(atEnd)).to.equal(true);
      });

      it('should not intersect perpendicular axis-aligned line segments', () => {
        const line = new GeoLine(4, 0, 4, 6); // y-axis aligned
        const outsideStart = [{ x: 0, y: -1 }, { x: 10, y: -1 }]; // x-axis aligned
        const outsideEnd = [{ x: 0, y: 7 }, { x: 10, y: 7 }]; // x-axis aligned

        expect(line.intersectsLine(outsideStart)).to.equal(false);
        expect(line.intersectsLine(outsideEnd)).to.equal(false);
      });

      it('should intersect perpendicular non-axis-aligned line segments', () => {
        const line = new GeoLine(-3, -3, 3, 3);
        const line2 = [{ x: -3, y: 3 }, { x: 3, y: -3 }];
        const atStart = [{ x: -5, y: -1 }, { x: -1, y: -5 }];
        const atEnd = [{ x: 1, y: 5 }, { x: 5, y: 1 }];

        expect(line.intersectsLine(line2)).to.equal(true);
        expect(line.intersectsLine(atStart)).to.equal(true);
        expect(line.intersectsLine(atEnd)).to.equal(true);
      });

      it('should not intersect perpendicular non-axis-aligned line segments', () => {
        const line = new GeoLine(-3, -3, 3, 3);
        const atStart = [{ x: -6, y: -1 }, { x: -1, y: -6 }];
        const atEnd = [{ x: 1, y: 6 }, { x: 6, y: 1 }];

        expect(line.intersectsLine(atStart)).to.equal(false);
        expect(line.intersectsLine(atEnd)).to.equal(false);
      });

      it('should intersect non-perpendicular non-axis-aligned line segments', () => {
        const line = new GeoLine(0, 0, 3, 3);
        const line2 = [{ x: 3, y: 5 }, { x: 3, y: 0 }];
        const line3 = [{ x: -1, y: 3 }, { x: 1, y: -1 }];
        const line4 = [{ x: 2, y: 0 }, { x: 2, y: 2 }];
        const line5 = [{ x: 2, y: 2 }, { x: 2, y: 0 }];

        expect(line.intersectsLine(line2)).to.equal(true);
        expect(line.intersectsLine(line3)).to.equal(true);
        expect(line.intersectsLine(line4)).to.equal(true);
        expect(line.intersectsLine(line5)).to.equal(true);
      });

      it('should not intersect non-perpendicular non-axis-aligned line segments', () => {
        const line = new GeoLine(0, 0, 3, 3);
        const line2 = [{ x: 2, y: 0 }, { x: 4, y: 4 }];
        const line3 = [{ x: -1, y: 3 }, { x: 0, y: -3 }];

        expect(line.intersectsLine(line2)).to.equal(false);
        expect(line.intersectsLine(line3)).to.equal(false);
      });

      it('should intersect collinear axis-aligned line segments', () => {
        const line = new GeoLine(0, 0, 0, 5);
        const line2 = [{ x: 0, y: 1 }, { x: 0, y: 3 }]; // Inside
        const line3 = [{ x: 0, y: 1 }, { x: 0, y: -1 }]; // Start inside, end outside of first edge
        const line4 = [{ x: 0, y: -1 }, { x: 0, y: 0 }]; // Start outside, end on first egde
        const line5 = [{ x: 0, y: 4 }, { x: 0, y: 7 }]; // Start inside, end outside of last edge
        const line6 = [{ x: 0, y: 5 }, { x: 0, y: 7 }]; // Start on last edge, end outside last edge
        const line7 = [{ x: 0, y: 0 }, { x: 0, y: -1 }]; // Start on first edge, end outside first edge

        expect(line.intersectsLine(line2)).to.equal(true);
        expect(line.intersectsLine(line3)).to.equal(true);
        expect(line.intersectsLine(line4)).to.equal(true);
        expect(line.intersectsLine(line5)).to.equal(true);
        expect(line.intersectsLine(line6)).to.equal(true);
        expect(line.intersectsLine(line7)).to.equal(true);
      });

      it('should not intersect if any of the line segment has zero size', () => {
        const line = new GeoLine(1, 1, 1, 1);
        const line2 = [{ x: 0, y: 1 }, { x: 0, y: 1 }];

        const line3 = new GeoLine(0, 0, 1, 1);
        const line4 = [{ x: 1, y: 1 }, { x: 1, y: 1 }];

        expect(line.intersectsLine(line2)).to.equal(false);
        expect(line3.intersectsLine(line4)).to.equal(false);
      });
    });

    describe('Rect', () => {
      it('should intersect if line is inside rect', () => {
        const line = new GeoLine(0, 0, 5, 5);
        const rectVertices = [{ x: -1, y: -1 }, { x: 6, y: -1 }, { x: 6, y: 6 }, { x: -1, y: 6 }];

        expect(line.intersectsRect(rectVertices)).to.equal(true);
      });

      it('should intersect if start or end of line is inside rect', () => {
        const line = new GeoLine(-10, -10, 5, 5);
        const line2 = new GeoLine(5, 5, 15, 15);
        const rectVertices = [{ x: -1, y: -1 }, { x: 6, y: -1 }, { x: 6, y: 6 }, { x: -1, y: 6 }];

        expect(line.intersectsRect(rectVertices)).to.equal(true);
        expect(line2.intersectsRect(rectVertices)).to.equal(true);
      });

      it('should intersect if line is collinear with rect circumference', () => {
        const line = new GeoLine(-1, 0, 5, 0); // end on rect circumference
        const line2 = new GeoLine(-1, 0, 15, 0); // start and end outside rect circumference
        const rectVertices = [{ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 6, y: 6 }, { x: 0, y: 6 }];

        expect(line.intersectsRect(rectVertices)).to.equal(true);
        expect(line2.intersectsRect(rectVertices)).to.equal(true);
      });

      it('should intersect if line is coincident with rect circumference', () => {
        const line = new GeoLine(0, 0, 6, 0);
        const line2 = new GeoLine(0, 6, 0, 0);
        const rectVertices = [{ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 6, y: 6 }, { x: 0, y: 6 }];

        expect(line.intersectsRect(rectVertices)).to.equal(true);
        expect(line2.intersectsRect(rectVertices)).to.equal(true);
      });

      it('should intersect if line is axis-aligned and crossing rect', () => {
        const line = new GeoLine(3, -1, 3, 9);
        const line2 = new GeoLine(-1, 3, 9, 3);
        const rectVertices = [{ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 6, y: 6 }, { x: 0, y: 6 }];

        expect(line.intersectsRect(rectVertices)).to.equal(true);
        expect(line2.intersectsRect(rectVertices)).to.equal(true);
      });

      it('should intersect if line is non-axis-aligned and crossing rect', () => {
        const line = new GeoLine(-1, -1, 12, 12);
        const rectVertices = [{ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 6, y: 6 }, { x: 0, y: 6 }];

        expect(line.intersectsRect(rectVertices)).to.equal(true);
      });

      it('should intersect if line start or end is on rect circumference', () => {
        const line = new GeoLine(6, 6, 12, 12);
        const line2 = new GeoLine(-3, -3, 0, 0);
        const rectVertices = [{ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 6, y: 6 }, { x: 0, y: 6 }];

        expect(line.intersectsRect(rectVertices)).to.equal(true);
        expect(line2.intersectsRect(rectVertices)).to.equal(true);
      });

      it('should not intersect if line outside rect circumference', () => {
        const line = new GeoLine(7, 7, 12, 12);
        const line2 = new GeoLine(-3, -3, -1, -1);
        const line3 = new GeoLine(-1, 0, -1, 6);
        const line4 = new GeoLine(0, -1, 6, -1);
        const rectVertices = [{ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 6, y: 6 }, { x: 0, y: 6 }];

        expect(line.intersectsRect(rectVertices)).to.equal(false);
        expect(line2.intersectsRect(rectVertices)).to.equal(false);
        expect(line3.intersectsRect(rectVertices)).to.equal(false);
        expect(line4.intersectsRect(rectVertices)).to.equal(false);
      });

      it('should not intersect if line segment has zero size', () => {
        const line = new GeoLine(1, 1, 1, 1);
        const rectVertices = [{ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 6, y: 6 }, { x: 0, y: 6 }];

        expect(line.intersectsRect(rectVertices)).to.equal(false);
      });

      it('should not intersect if rect has zero size', () => {
        const line = new GeoLine(0, 0, 1, 1);
        const rectVertices = [{ x: 1, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 1 }];

        expect(line.intersectsRect(rectVertices)).to.equal(false);
      });
    });

    describe('Circle', () => {
      it('should intersect a collinear line that start or end inside circle circumference', () => {
        const line = new GeoLine(0, 0, 12, 12);
        const line2 = new GeoLine(12, 12, 30, 30);
        const c = { cx: 10, cy: 10, r: 10 };

        expect(line.intersectsCircle(c)).to.equal(true);
        expect(line2.intersectsCircle(c)).to.equal(true);
      });

      it('should intersect a collinear line that crosses the circle circumference', () => {
        const line = new GeoLine(0, 0, 30, 30);
        const c = { cx: 10, cy: 10, r: 1 };

        expect(line.intersectsCircle(c)).to.equal(true);
      });

      it('should intersect a axis-aligned line that start or end inside circle circumference', () => {
        const line = new GeoLine(0, 9, 11, 9);
        const line2 = new GeoLine(9, 11, 9, 30);
        const c = { cx: 10, cy: 10, r: 3 };

        expect(line.intersectsCircle(c)).to.equal(true);
        expect(line2.intersectsCircle(c)).to.equal(true);
      });

      it('should intersect a axis-aligned line that crosses the circle circumference', () => {
        const line = new GeoLine(0, 7, 15, 7);
        const line2 = new GeoLine(7, 0, 7, 15);
        const c = { cx: 10, cy: 10, r: 3 };

        expect(line.intersectsCircle(c)).to.equal(true);
        expect(line2.intersectsCircle(c)).to.equal(true);
      });

      it('should not intersect a axis-aligned line outside the circle circumference', () => {
        const line = new GeoLine(0, 6, 15, 6);
        const line2 = new GeoLine(6, 0, 6, 15);
        const c = { cx: 10, cy: 10, r: 3 };

        expect(line.intersectsCircle(c)).to.equal(false);
        expect(line2.intersectsCircle(c)).to.equal(false);
      });

      it('should not intersect a collinear line that doesnt not cross or start/end on circle circumference', () => {
        const line = new GeoLine(0, 0, 3, 3);
        const line2 = new GeoLine(15, 15, 30, 30);
        const c = { cx: 10, cy: 10, r: 3 };

        expect(line.intersectsCircle(c)).to.equal(false);
        expect(line2.intersectsCircle(c)).to.equal(false);
      });

      it('should not intersect if line segment has zero size', () => {
        const line = new GeoLine(1, 1, 1, 1);
        const c = { cx: 0, cy: 0, r: 3 };

        expect(line.intersectsCircle(c)).to.equal(false);
      });

      it('should not intersect if circle has zero size', () => {
        const line = new GeoLine(0, 0, 1, 1);
        const c = { cx: 1, cy: 1, r: 0 };

        expect(line.intersectsCircle(c)).to.equal(false);
      });
    });
  });
});
